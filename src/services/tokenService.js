import { Buffer } from "buffer";

const setToken = (token) => {
    localStorage.setItem('token', token);
};

const getToken = () => {
    let token = localStorage.getItem('token');
    console.log('TOKEN: ', token);
    console.log('TOKEN TYPE: ', typeof token);
    if (token) {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
        if (payload.exp < (Date.now() / 1000)) {
            console.log('Token expired');
            localStorage.removeItem('token');
            token = null;
        };
    } else {
        localStorage.removeItem('token');
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