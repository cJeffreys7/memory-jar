import { Buffer } from "buffer";

const setToken = (token) => {
    localStorage.setItem('token', token);
};

const getToken = () => {
    let token = localStorage.getItem('token') || null;
    console.log('JSON Web Token: ', token ? JSON.parse(Buffer.from(token.split('.')[1], 'base64')) : 'NULL');
    if (token) {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
        // 9000 seconds is 2.5 hours
        // console.log('Token time: ', payload.exp + 60000);
        // console.log('Current time: ', Date.now() / 1000);
        if ((payload.exp + 600000) < (Date.now() / 1000)) {
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