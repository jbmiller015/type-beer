import axios from 'axios';


const instance = axios.create({
    //paste ngrok url here to connect
    //baseURL: 'https://ec2-3-132-249-207.us-east-2.compute.amazonaws.com:8080/',
    baseURL: 'http://localhost:8080/',
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
