import { createContext, useContext, useEffect, useState} from 'react'
import { loginUser, logoutUser, userProfile } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
        const res = await logoutUser();
        setUser(null);
        return res;
    };

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