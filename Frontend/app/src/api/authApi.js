import { data } from 'react-router-dom';
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
export const refreshAccessToken = async()=>{
    return await axiosInsatance.post('/auth/refresh-token');
}

export const forgetPassword = async(data)=>{
    return await axiosInsatance.post('/auth/forget-password', data);
}

export const resetPassword = async(data)=>{
    return await axiosInsatance.post(`/auth/reset-password`,data );
}


