import { Buffer } from "buffer";

const setToken = (token) => {
    localStorage.setItem('token', token);
};

const getToken = () => {
    let token = localStorage.getItem('token');
    if (token && token !== 'null') {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
        // const timeOffset = 18000 -> 5 hours offset of Cognito service time zone
        // const timeOffset = 18000
        console.log(` Expiration date: ${payload.exp}, current date: ${Date.now() / 1000}`);
        if (payload.exp < (Date.now() / 1000)) {
            console.log('Token expired');
            localStorage.removeItem('token');
            token = null;
        };
    } else {
        localStorage.removeItem('token');
        token = null;
    };
    return token;
}

const getUserFromToken = () => {
    const token = getToken();
    return token ? JSON.parse(Buffer.from(token.split('.')[1], 'base64')) : null;
};

const removeToken = () => {
    localStorage.removeItem('token');
};

export {
    setToken,
    getToken,
    getUserFromToken,
    removeToken
}