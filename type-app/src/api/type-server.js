import axios from 'axios';


const instance = axios.create({
    baseURL: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:8080/' : 'https://type-beer-349121.uc.r.appspot.com/',
    header: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
    }
});

const appendSessionResponse = (responseData, url) => {
    const sessionObj = JSON.parse(sessionStorage.getItem(url));
    console.log(sessionObj)
    if (sessionObj) {
        responseData.push(...sessionObj)
        return responseData;
    }
}

instance.interceptors.response.use((response) => {
    const token = localStorage.getItem('token');
    if (token && token.includes("demoToken")) {
        if (response.config.method === 'get') {
            let responseData = response.data;
            const objType = response.config.url.slice(6).split('/');
            if (objType[0] === 'beer') {
                if (!objType[1]) {
                    responseData = appendSessionResponse(responseData, response.config.url);
                } else {

                }
            }
            if (objType[0] === 'tank') {
                if (!objType[1]) {
                    responseData = appendSessionResponse(responseData, response.config.url);
                } else {

                }
            }
            if (objType[0] === 'process') {
                if (!objType[1]) {
                    responseData = appendSessionResponse(responseData, response.config.url);
                } else {

                }
            }
            if (objType[0] === 'event') {
                if (!objType[1]) {
                    responseData = appendSessionResponse(responseData, response.config.url);
                } else {

                }
            }
            response.data = responseData ? responseData : response.data;
        }
    }
    console.log(response.data)
    console.log(response.config.url)
    return response;
})

//automatically add authorization to requests once logged in
instance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (token && token.includes("demoToken")) {
            if (config.url.includes('active')) {
                config.url = '/demo/process/'
            } else {
                config.url = '/demo' + config.url;
            }
            if (config.method === 'post') {
                let obj = JSON.parse(sessionStorage.getItem(config.url));
                const adder = config.data;
                adder['_id'] = crypto.randomUUID();
                if (obj) {
                    obj = [...obj, adder];
                    sessionStorage.setItem(config.url, JSON.stringify(obj));
                } else {
                    sessionStorage.setItem(config.url, JSON.stringify([adder]));
                }
                config.adapter = (config) => {
                    return new Promise((resolve, reject) => {
                        const res = {
                            data: "",
                            status: 200,
                            statusText: "OK",
                            headers: {"content-type": "text/plain; charset=utf-8"},
                            config,
                            request: {}
                        }
                        return resolve(res);
                    })
                }
            }
            if (config.method === 'put') {
                /**
                 let obj = JSON.parse(sessionStorage.getItem(config.url));
                 let modder = config.url.slice(6).split('/');
                 if()
                 const adder = config.data;
                 adder['_id'] = crypto.randomUUID();
                 if (obj) {
                 obj = [...obj, adder];
                 sessionStorage.setItem(config.url, JSON.stringify(obj));
                 } else {
                 sessionStorage.setItem(config.url, JSON.stringify([adder]));
                 }
                 config.adapter = (config) => {
                 return new Promise((resolve, reject) => {
                 const res = {
                 data: "",
                 status: 200,
                 statusText: "OK",
                 headers: {"content-type": "text/plain; charset=utf-8"},
                 config,
                 request: {}
                 }
                 return resolve(res);
                 })
                 }
                 */
            }
            if (config.method === 'delete') {
            }
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default instance;
