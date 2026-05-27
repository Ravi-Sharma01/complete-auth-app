import axios from 'axios'

const axiosInsatance = axios.create({
    baseURL:'http://localhost:3000/api',
    withCredentials:true
});

export default axiosInsatance;