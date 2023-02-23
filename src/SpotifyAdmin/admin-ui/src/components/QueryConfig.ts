const queryConfig = (token: string) => { return {
    headers: { Authorization: `Bearer ${token}` },
    baseURL: 'http://localhost:8080/api/'
}};

const queryConfigMultipart = (token: string) =>  { return {
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data; boundary=myBoundary'
    },
    baseURL: 'http://localhost:8080/api/'
}};


function getToken() {
    let cookie: {[name:string]: string} = {};
    document.cookie.split(';').forEach(function(el) {
        let [key,value] = el.split('=');
        cookie[key.trim()] = value;
    })
    return cookie['SAT'];
}

export {
    queryConfigMultipart,
    queryConfig,
    getToken
}