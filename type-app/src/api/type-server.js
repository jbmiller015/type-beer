import axios from 'axios';


const instance = axios.create({
    baseURL: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:8080/' : 'https://type-beer-349121.uc.r.appspot.com/',
    header: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
    }
});

//automatically add authorization to requests once logged in
instance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default instance;
