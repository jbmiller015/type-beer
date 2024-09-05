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
    ////console.log(url)
    ////console.log(sessionObj)
    ////console.log(editObj)
    ////console.log(deleteObj)
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
    ////console.log(result)
    if (deleteObj) {
        result = result.filter((el) => {
            ////console.log(el)
            return !deleteObj.includes(el._id)
        });
    }
    if (sessionObj) {
        result.push(...sessionObj)
    }
    ////console.log(result)
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
    ////console.log(response.data)
    ////console.log(response.config.url)
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
                config.url = '/demo/process/active'
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
                //TODO: 'replace' default objs with editted ones by setting session data and replacing json data in get requests.
                //[blank,demo,objName,Id]
                const modder = config.url.split('/');
                //console.log(modder)
                const sessionObj = JSON.parse(sessionStorage.getItem(`/${modder[1]}/${modder[2]}`));
                //console.log(sessionObj)
                const adder = config.data;
                //console.log(adder)
                let result = [];
                if (sessionObj && sessionObj.find((el) => el._id === modder[3])) {
                    result = sessionObj.map((el) => {
                        if (el._id === modder[3])
                            return adder;
                        return el;
                    });
                    //console.log(result)
                    sessionStorage.setItem(`/${modder[1]}/${modder[2]}`, JSON.stringify(result))
                } else {
                    const editObj = JSON.parse(sessionStorage.getItem(`/edit/${modder[1]}/${modder[2]}`));
                    if (editObj) {
                        result = editObj.map((el) => {
                            if (el._id === modder[3])
                                return adder;
                            return el;
                        });
                        //console.log(result)
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
                    //[blank,demo,objName,Id]
                    const modder = config.url.split('/');
                    console.log("modder:", modder)
                    const sessionObj = JSON.parse(sessionStorage.getItem(`/${modder[1]}/${modder[2]}`));
                    const editObj = JSON.parse(sessionStorage.getItem(`/edit/${modder[1]}/${modder[2]}`));
                    let deleteObj = JSON.parse(sessionStorage.getItem(`/delete/${modder[1]}/${modder[2]}`));
                    console.log(sessionObj)
                    console.log(deleteObj)
                    console.log(editObj)
                    const adder = "config.data";
                    let result;
                    if (sessionObj && sessionObj.find((el) => el._id === modder[3])) {
                        result = sessionObj.filter((el) => el._id !== modder[3]);
                        if (result?.length) {
                            console.log("result:", result)
                            sessionStorage.setItem(`/${modder[1]}/${modder[2]}`, JSON.stringify(result));
                        } else {
                            sessionStorage.removeItem(`/${modder[1]}/${modder[2]}`);
                        }
                    } else if (deleteObj?.length) {
                        console.log(deleteObj)
                        console.log(modder[3])
                        deleteObj.push(modder[3]);
                        console.log("deleteObj:", deleteObj)
                        sessionStorage.setItem(`/delete/${modder[1]}/${modder[2]}`, JSON.stringify(deleteObj))

                    } else {
                        console.log("deleteObj.push(modder[3]):", [modder[3]])
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
                    ////console.log(err)
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
