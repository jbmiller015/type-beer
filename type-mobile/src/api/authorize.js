import axios from 'axios';
import {AsyncStorage} from "react-native";

const instance = axios.create({
    //paste ngrok url here to connect
    baseURL: 'http://edd879321c0b.ngrok.io/'
});

//automatically add authorization to requests once logged in
instance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
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
