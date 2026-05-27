import axiosInsatance from '../services/axiosInstance'

export const registerUser = async(data)=>{
    return await axiosInsatance.post('/auth/registerUser',data)
};

export   const loginUser = async(data)=>{
    return await axiosInsatance.post('/auth/login', data);
};

export const userProfile = async()=>{
    return await axiosInsatance.get('/auth/user');
}
export const logoutUser = async()=>{
    return await axiosInsatance.get('/auth/logout');
}