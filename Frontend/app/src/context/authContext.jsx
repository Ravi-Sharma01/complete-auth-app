import { createContext, useContext, useEffect, useRef, useState} from 'react'
import { loginUser, logoutUser, refreshAccessToken, userProfile } from '../api/authApi';
import axiosInsatance from '../services/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const isRefreshing = useRef(false); // to stop multilple request when token renwed
    const failedQueue = useRef([]); // to store other 401 requests

    //resolve request one by one from failedQues
    const processQueue = (error)=>{
        failedQueue.current.forEach(({resolve, reject})=>{
            if (error){
                reject(error);
            }else{
                resolve();
            }
        });
        failedQueue.current = []; //when all request is resolved then empty failedQues
    }

    const fetchUser = async ()=>{
        try {
            const res = await userProfile();
            setUser(res.data.user);
        } catch (error) {
            setUser(null);
        }finally{
            setLoading(false);
        }
    };

    const login = async (payload)=>{
        const res = await loginUser(payload)
        setUser(res.data.user);
        return res;
    };


    const logout = async()=>{
        setUser(null); // imidiate logout without waiting response from server
        try {
            const res = await logoutUser();
           
            return res;
        } catch (error) {
             console.error("Backend logout failed, but user session cleared locally", error);
        }
    };


    useEffect(()=>{
        const interceptorId = axiosInsatance.interceptors.response.use(
            (response)=> response,
            async (error)=>{

                // request details like url, method etc
                const originalRequest = error.config;

                //check if not found any request or a error response
                if(!originalRequest || !error.response){
                    return Promise.reject(error);
                }

                // if error is a unauthorized for token invalid or not found
                const isUnauthorized = error.response.status === 401;

                //check if request is a renew access token url
                const isRefreshRequest = originalRequest.url?.includes('/auth/refresh-token');

                //check if is not unauthorized or retry on same request or is refresh-token request
                if(!isUnauthorized || originalRequest._retry || isRefreshRequest){
                    return Promise.reject(error);
                }

                //mark original request retry =>true
                originalRequest._retry = true

                // check if refresh-token request is running then other  401 requests collect in failedQues
                //when resolves the request then pass in axiosinstance
                if(isRefreshing.current){
                    return new Promise((resolve, reject)=>{
                        failedQueue.current.push({resolve, reject})
                    }).then(()=>axiosInsatance(originalRequest)) // when processQues() resolve resquest it send to backned fetch data
                }

                //first time renew access token refresh-token request is running then set is refeshing => true
                isRefreshing.current = true;
                try {
                    await refreshAccessToken(); // new access token from backend
                    processQueue(null); // call processQues to resolve stored 401 reqs with no error params
                    return axiosInsatance(originalRequest); // return reffresh-token request
                    
                } catch (refresherror) {
                    processQueue(refresherror); //with errors
                    setUser(mull);
                    return Promise.reject(refresherror);
                }finally{
                    isRefreshing.current = false; //when token is renewd then then set isRefreshing falsee
                }
            }

        );
        //after all process remove interceptor to clenup memory to prevent lose data
        return ()=>{
            axiosInsatance.interceptors.response.eject(interceptorId);
            processQueue(new Error('Auth interceptor removed'));
        }
    },[])

    useEffect(()=>{
        fetchUser();
    }, []);

    return(
        <AuthContext.Provider value={{user, loading, login, logout, fetchUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = ()=>{
    return useContext(AuthContext);
}