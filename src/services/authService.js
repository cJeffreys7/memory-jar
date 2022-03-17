import { CognitoUserPool, CognitoUser, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js';
import * as tokenService from './tokenService'

const userPool = new CognitoUserPool({
    UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    ClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID
});

const getUser = () => {
    return tokenService.getUserFromToken();
}

const loginUser = (email, password) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });

    const authenticationData = { Username: email, Password: password };
    
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) =>
        user.authenticateUser(authenticationDetails, {
            onSuccess: result => {
                tokenService.setToken(result.getIdToken().getJwtToken());
                resolve(result);
            },
            onFailure: err => {
                reject(err);
            }
        })
    );
};

const logoutUser = () => {
    const currentUser = getUser();
    if (currentUser !== null) {
        const user = new CognitoUser({ Username: currentUser['cognito:username'], Pool: userPool })
        user.signOut();
        tokenService.removeToken();
    }
}

const signUpUser = async (name, email, password) => {
    const emailAttribute = new CognitoUserAttribute({
        Name: 'email',
        Value: email
    });
    const nameAttribute = new CognitoUserAttribute({
        Name: 'name',
        Value: name
    });

    let attributes = [emailAttribute, nameAttribute];

    console.log('Attempting to sign up user: ', userPool);

    return new Promise((resolve, reject) =>
        userPool.signUp(email, password, attributes, null, ((error, result) => {
            if (error) {
                reject(error);
                console.log('Signup failed: ', error);
                console.log(result);
            } else {
                resolve(result);
                // console.log('Last Auth User key: ', `CognitoIdentityServiceProvider.${process.env.REACT_APP_COGNITO_ID}.LastAuthUser`);
                const lastAuthUser = result.user.storage.getItem(`CognitoIdentityServiceProvider.${process.env.REACT_APP_COGNITO_ID}.LastAuthUser`);
                // console.log('LAST AUTH USER: ', lastAuthUser);
                const idToken = result.user.storage.getItem(`CognitoIdentityServiceProvider.${process.env.REACT_APP_COGNITO_ID}.${lastAuthUser}.idToken`);
                // console.log('RESULT: ', result);
                // console.log('Signup successful: ', idToken);
                tokenService.setToken(idToken);
                // tokenService.setToken(result.getJwtToken());
            }
            // onSuccess: result => {
            //     resolve(result);
            //     tokenService.setToken(result.getIdToken().getJwtToken());
            //     console.log('Login successful: ', result);
            // },
            // onFailure: err => {
            //     reject(err);
            //     console.log('Login failed: ', err);
            // }
        }))
    );
}

export {
    getUser,
    loginUser,
    logoutUser,
    signUpUser
}