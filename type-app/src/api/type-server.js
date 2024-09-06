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
    const editObj = JSON.parse(sessionStorage.getItem(`/edit${url}`));
    const deleteObj = JSON.parse(sessionStorage.getItem(`/delete${url}`));

    let result = responseData;
    if (editObj) {
        result = responseData.map((el) => {

            for (let le in editObj) {

                if (editObj[le]._id === el._id) {

                    return editObj[le];
                }
            }
            return el;
        });
    }

    if (deleteObj) {
        result = result.filter((el) => {

            return !deleteObj.includes(el._id)
        });
    }
    if (sessionObj) {
        result.push(...sessionObj)
    }

    return result;
}

instance.interceptors.response.use((response) => {
    const token = localStorage.getItem('token');
    if (token && token.includes("demoToken")) {
        if (response.config.method === 'get') {
            let responseData = response.data;
            console.log(response.config.url)
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
                    console.log("objType", objType)
                    responseData = appendSessionResponse(responseData, response.config.url);
                } else {
                    console.log(objType[1])
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
                config.url = '/demo/process'
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
                const modder = config.url.split('/');
                const sessionObj = JSON.parse(sessionStorage.getItem(`/${modder[1]}/${modder[2]}`));
                const adder = config.data;
                let result = [];
                if (sessionObj && sessionObj.find((el) => el._id === modder[3])) {
                    result = sessionObj.map((el) => {
                        if (el._id === modder[3])
                            return adder;
                        return el;
                    });
                    sessionStorage.setItem(`/${modder[1]}/${modder[2]}`, JSON.stringify(result))
                } else {
                    const editObj = JSON.parse(sessionStorage.getItem(`/edit/${modder[1]}/${modder[2]}`));
                    if (editObj) {
                        result = editObj.map((el) => {
                            if (el._id === modder[3])
                                return adder;
                            return el;
                        });
                        sessionStorage.setItem(`/edit/${modder[1]}/${modder[2]}`, JSON.stringify(result))
                    } else {
                        sessionStorage.setItem(`/edit/${modder[1]}/${modder[2]}`, JSON.stringify([adder]));
                    }
                }

                config.adapter = (config) => {
                    return new Promise((resolve, reject) => {
                        const res = {
                            data: adder,
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
            if (config.method === 'delete') {
                try {
                    const modder = config.url.split('/');
                    const sessionObj = JSON.parse(sessionStorage.getItem(`/${modder[1]}/${modder[2]}`));
                    const editObj = JSON.parse(sessionStorage.getItem(`/edit/${modder[1]}/${modder[2]}`));
                    let deleteObj = JSON.parse(sessionStorage.getItem(`/delete/${modder[1]}/${modder[2]}`));
                    const adder = "config.data";
                    let result;
                    if (sessionObj && sessionObj.find((el) => el._id === modder[3])) {
                        result = sessionObj.filter((el) => el._id !== modder[3]);
                        if (result?.length) {
                            sessionStorage.setItem(`/${modder[1]}/${modder[2]}`, JSON.stringify(result));
                        } else {
                            sessionStorage.removeItem(`/${modder[1]}/${modder[2]}`);
                        }
                    } else if (deleteObj?.length) {
                        deleteObj.push(modder[3]);
                        sessionStorage.setItem(`/delete/${modder[1]}/${modder[2]}`, JSON.stringify(deleteObj))

                    } else {
                        sessionStorage.setItem(`/delete/${modder[1]}/${modder[2]}`, JSON.stringify([modder[3]]))
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
                } catch (err) {
                    console.log(err)
                }
            }
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default instance;
