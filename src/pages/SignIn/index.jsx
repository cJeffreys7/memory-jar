import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createTheme } from '@mui/material';
import { connect } from 'react-redux';
import { setCurrentPath } from '../../redux/Path/pathActions';

// components
import FormInput from '../../components/FormInput';
import Button from '../../components/MUI/StyledButton';

// services
import * as authService from '../../services/authService'

// assets
import Icon from '../../assets/memoryjar_icon.svg'
import LogoText from '../../assets/memoryjar_logo_text_dark.svg'

import './styles.scss'
import variables from '../../styles.scss';

const initialFormData = {
    email: '',
    password: ''
}

const initialErrors = {}

const SignIn = (props) => {
    const navigate = useNavigate();
    const { setCurrentPath } = props;
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState(initialErrors);

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({
            ...errors,
            [`${e.target.name}Entry`]: true
        });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await authService.loginUser(email, password);
            props.handleSignUpOrSignIn(email);
            setFormData(initialFormData);
            setErrors(initialErrors);
            navigate('/home');
        } catch (error) {
            console.log(error);
            setErrors({
                ...errors,
                feedbackErrorText: error.message
            });
        };
    };

    const { 
            email, 
            password 
        } = formData;
    const { 
            emailEntry, 
            emailError, 
            emailHelperText, 
            passwordEntry, 
            passwordError, 
            passwordHelperText,
            feedbackErrorText
        } = errors;

    useEffect(() => {
        const formCheck = async => {
            let errors = [];
            if (emailEntry) {
                errors.push({ emailEntry: true });
                errors.push(emailValidation());
            }
            if (passwordEntry) {
                errors.push({ passwordEntry: true });
                errors.push(passwordValidation());
            }
            let formErrors = {};
            errors.forEach(error => {
                formErrors = {
                    ...formErrors,
                    ...error
                }
            })
            setErrors({
                ...errors,
                ...formErrors
            })
        }

        formCheck();
        // eslint-disable-next-line
    }, [email, password]);

    useEffect(() => {
        setCurrentPath('SignIn');
        // eslint-disable-next-line
    }, []);

    const emailValidation = () => {
        let error = {};
        if (!email) {
            error = {
                emailError: true,
                emailHelperText: 'Please enter your email'
            };
        } else {
            const emailExpression = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:+)\])/g;
            const emailRegExp = new RegExp(emailExpression)
            if (email.match(emailRegExp)) {
                error = {
                    emailError: false
                };
            } else {
                error = {
                    emailError: true,
                    emailHelperText: 'Invalid email'
                };
            };
        };

        return error;
    };

    const passwordValidation = () => {
        let error = {};
        if (!password) {
            error = {
                passwordError: true,
                passwordHelperText: 'Please enter a password'
            };
        } else {
            error = {
                passwordError: false
            };
        };
        return error;
    };

    const isFormInvalid = () => {
        return (!(email && password) || errors.passwordError || errors.emailError);
    };

    const theme = createTheme({
        palette: {
            primary: {
                main: '#000000'
            },
        }
    });

    const signInInputSX = {
        maxWidth: 1280,
        backgroundColor: variables.primaryColor,
        borderRadius: '32px'
    }

    // const resetPassword = (username) => {
    //     const poolData = {
    //         UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    //         ClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID
    //     };
    //     const userPool = new CognitoUserPool(poolData);
    
    //     // setup cognitoUser first
    //     const cognitoUser = new CognitoUser({
    //         Username: username,
    //         Pool: userPool
    //     });
    
    //     // call forgotPassword on cognitoUser
    //     cognitoUser.forgotPassword({
    //         onSuccess: function(result) {
    //             console.log('call result: ', result);
    //         },
    //         onFailure: function(err) {
    //             alert(err);
    //         },
    //         inputVerificationCode() { // this is optional, and likely won't be implemented as in AWS's example (i.e, prompt to get info)
    //             var verificationCode = prompt('Please input verification code ', '');
    //             var newPassword = prompt('Enter new password ', '');
    //             cognitoUser.confirmPassword(verificationCode, newPassword, this);
    //         }
    //     });
    // }
    
    // // confirmPassword can be separately built out as follows...  
    // const confirmPassword = (username, verificationCode, newPassword) => {
    //     const userPool = new CognitoUserPool({
    //         UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    //         ClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID
    //     });
    //     const cognitoUser = new CognitoUser({
    //         Username: username,
    //         Pool: userPool
    //     });
    
    //     return new Promise((resolve, reject) => {
    //         cognitoUser.confirmPassword(verificationCode, newPassword, {
    //             onFailure(err) {
    //                 reject(err);
    //             },
    //             onSuccess() {
    //                 resolve();
    //             },
    //         });
    //     });
    // }

    return (
        <div className='wrapper'>
            <img src={Icon} alt='Memory Jar Icon' />
            <img src={LogoText} alt='Memory Jar' />
            <div className='signin-wrapper'>
                <form onSubmit={handleSubmit}>
                    <FormInput 
                        className='input'
                        name='email'
                        type='email'
                        label='Email'
                        error={emailError}
                        helperText={emailError ? emailHelperText : ''}
                        value={email}
                        onChange={handleChange}
                        sx={signInInputSX}
                    />
                    <FormInput 
                        className='input'
                        name='password'
                        type='password'
                        label='Password'
                        error={passwordError}
                        helperText={passwordError ? passwordHelperText : ''}
                        value={password}
                        onChange={handleChange}
                        sx={signInInputSX}
                    />
                    {/* <Link to='/signin'>Forgot your password?</Link> */}
                    <Button 
                        theme={theme}
                        type='submit' 
                        label='Login' 
                        disabled={isFormInvalid()}
                    />
                </form>
                <h4 className='error-message'>{feedbackErrorText}</h4>
                <span className='signup-prompt'>Don't have an account?</span>
                <Link className='call-to-action' to='/signup'>Sign up</Link>
            </div>
        </div>
    );
};

SignIn.defaultProps = {
    currentPath: null
};

const mapStateToProps = ({ path }) => ({
    currentPath: path.currentPath
});

const mapDispatchToProps = dispatch => ({
    setCurrentPath: path => dispatch(setCurrentPath(path))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);