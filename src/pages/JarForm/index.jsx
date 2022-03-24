import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { createTheme } from '@mui/material';

// components
import FormInput from '../../components/FormInput';
import JarViewer from '../../components/JarViewer';
import Button from '../../components/MUI/StyledButton';
import { setCurrentMemoryJar } from '../../redux/MemoryJar/memoryJarActions';

// services
import * as memoryJarService from '../../services/memoryJarService'

import './styles.scss'
import variables from '../../styles.scss'

const initialErrors = {};

const JarForm = (props) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { currentUser, currentMemoryJar, setCurrentMemoryJar } = props;
    const [errors, setErrors] = useState(initialErrors);
    const [formData, setFormData] = useState({
        owner: currentUser?.id,
        title: '',
        description: ''
    });
    const [viewerPermissions, setViewerPermissions] = useState({
        email: '',
        viewers: [],
        admins: []
    });
    const [emailSubmission, setEmailSubmission] = useState(false)

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({
            ...errors,
            [`${e.target.name}Entry`]: true
        });
    };

    const handleRemoveViewer = e => {
        const updatedAdmins = viewerPermissions.admins.filter(admin => e.target.value !== admin);
        const updatedViewers = viewerPermissions.viewers.filter(viewer => e.target.value !== viewer);
        setViewerPermissions({
            ...viewerPermissions,
            admins: updatedAdmins,
            viewers: updatedViewers
        });
    }

    const handleChangeEmail = e => {
        if (e.target.name !== 'email') {
            let updatedAdmins = [];
            if (e.target.value === 'true') {
                updatedAdmins = viewerPermissions.admins;
                updatedAdmins.push(e.target.name);
            } else {
                updatedAdmins = viewerPermissions.admins
                .filter(
                    admin => admin !== e.target.name
                );
            }
            setViewerPermissions({
                ...viewerPermissions,
                admins: updatedAdmins
            });
        } else {
            setViewerPermissions({
                ...viewerPermissions,
                email: e.target.value
            });
            setErrors({
                ...errors,
                [`${e.target.name}Entry`]: true
            });
        };
    };

    const handleEmailInviteSubmit = e => {
        e.preventDefault();
        setEmailSubmission(true);
        console.log(`Sending invite to ${viewerPermissions.email}`);
        setViewerPermissions({
            ...viewerPermissions,
            viewers: [
                ...viewers,
                email.toLowerCase()
            ],
            email: ''
        });
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!currentMemoryJar) {
            admins.unshift(currentUser.id);
            viewers.unshift(currentUser.id);
        };
        let formattedFormData = {
            admins: admins,
            viewers: viewers,
            ...formData
        };
        let result;
        if (currentMemoryJar) {
            formattedFormData = {
                ...formattedFormData,
                jarId: currentMemoryJar.jarId,
                memories: currentMemoryJar.memories
            }
            result = memoryJarService.updateJar(currentMemoryJar.jarId, formattedFormData);
        } else {
            result = memoryJarService.saveJar(formattedFormData);
        }
        if (result) {
            if (currentMemoryJar) {
                navigate(-1)
            } else {
                navigate('/home');
            }
        };
    }

    const { title, description } = formData;
    const { email, viewers, admins } = viewerPermissions;

    const { 
        titleEntry,
        titleError,
        titleHelperText,
        descriptionEntry,
        descriptionError,
        descriptionHelperText,
        emailEntry,
        emailError,
        emailHelperText
    } = errors;

    useEffect(() => {
        const formCheck = async => {
            let errors = [];
            if (titleEntry) {
                errors.push({ titleEntry: true });
                errors.push(titleValidation());
            };
            if (descriptionEntry) {
                errors.push({ descriptionEntry: true });
                errors.push(descriptionValidation());
            };
            if (emailSubmission) {
                errors.push({ emailEntry: false })
                setEmailSubmission(false);
            } else if (emailEntry) {
                errors.push({ emailEntry: true });
                errors.push(emailValidation());
            };
            let formErrors = {};
            errors.forEach(error => {
                formErrors = {
                    ...formErrors,
                    ...error
                };
            });
            setErrors({
                ...errors,
                ...formErrors
            });
        }

        formCheck();
        // eslint-disable-next-line
    }, [title, description, email]);

    // Reset form data if currentMemoryJar is cleared
    // Edit Memory Jar to New Memory Jar
    useEffect(() => {
        setFormData({
            owner: currentUser?.id,
            title: currentMemoryJar ? currentMemoryJar.title : '',
            description: currentMemoryJar ? currentMemoryJar.description : ''
        });
        setViewerPermissions({
            email: '',
            viewers: currentMemoryJar ? currentMemoryJar.viewers : [],
            admins: currentMemoryJar ? currentMemoryJar.admins : []
        });
        // eslint-disable-next-line
    }, [currentMemoryJar])

    useEffect(() => {
        const getMemoryJar = async (jarId) => {
            if (!currentMemoryJar) {
                const memoryJar = await memoryJarService.getJar(jarId);
                setCurrentMemoryJar(memoryJar.data);
            };
        };

        getMemoryJar(id);
        // eslint-disable-next-line
    }, [])


    const titleValidation = () => {
        let error = {};
        if (!title) {
            error = {
                titleError: true,
                titleHelperText: 'Please enter a name for this Memory Jar'
            }
        } else {
            error = {
                titleError: false
            }
        }
        return error;
    }

    const descriptionValidation = () => {
        let error = {};
        if (!description) {
            error = {
                descriptionError: true,
                descriptionHelperText: 'Please enter a description for this Memory Jar'
            }
        } else {
            error = {
                descriptionError: false
            }
        }
        return error;
    }

    const emailValidation = () => {
        let error = {};
        if (!email) {
            error = {
                emailError: true,
                emailHelperText: 'Please enter an email to view this memory jar'
            };
        } else if (viewerPermissions?.viewers && (viewerPermissions.viewers.includes(email.toLowerCase()) || email.toLowerCase() === currentUser?.id.toLowerCase())) {
            error = {
                emailError: true,
                emailHelperText: 'Email already allowed to view this memory jar'
            };
        } else {
            const emailExpression = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:+)\])/g;
            const emailRegExp = new RegExp(emailExpression);
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
    }

    const isFormInvalid = () => {
        return !(title && description)
    };

    const isEmailInvalid = () => {
        return (!email || errors.emailError)
    };

    const theme = createTheme({
        palette: {
            primary: {
                main: variables.callToActionColor
            },
        }
    });

    return (
        <div className='jar-wrapper'>
            <div className='memory-jar-form'>
                <form className='jar-details-form'>
                    <FormInput 
                        className='input'
                        name='title'
                        type='text'
                        label={currentMemoryJar ? 'Memory Jar Name' : 'New Memory Jar Name'}
                        error={titleError}
                        helperText={titleError ? titleHelperText : ''}
                        value={title}
                        onChange={handleChange}
                        variant='standard'
                    />
                    <FormInput 
                        className='input'
                        name='description'
                        type='text'
                        label='Description'
                        error={descriptionError}
                        helperText={descriptionError ? descriptionHelperText : ''}
                        multiline={true}
                        rows={8}
                        value={description}
                        onChange={handleChange}
                        variant='outlined'
                    />
                </form>
                <span className='form-title'>Share Memory Jar</span>
                <form className='share-jar-form'>
                    <FormInput 
                        className='input'
                        name='email'
                        type='text'
                        label='Email'
                        error={emailError}
                        helperText={emailError ? emailHelperText : ''}
                        value={email}
                        onChange={handleChangeEmail}
                        variant='standard'
                    />
                    <Button
                        theme={theme}
                        type='submit'
                        label='Share'
                        handleClick={handleEmailInviteSubmit}
                        disabled={isEmailInvalid()}
                    />
                </form>
                <div className='jar-permissions'>
                    <div className='permissions-headers'>
                        <h5 id='viewers-header-title'>Viewers</h5>
                        <h5>Can Edit</h5>
                    </div>
                    <div className='jar-permissions-border'>
                        <div className='jar-permission-viewers'>
                            {viewerPermissions.viewers && 
                                viewerPermissions.viewers
                                .filter(viewer => viewer !== currentUser.id)
                                .map(viewer => (
                                    <JarViewer
                                        key={viewer}
                                        email={viewer}
                                        canEdit={viewerPermissions.admins.includes(viewer)}
                                        handleChange={handleChangeEmail}
                                        handleOnClick={handleRemoveViewer}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
                <Button 
                    theme={theme}
                    type='submit'
                    label='Submit'
                    disabled={isFormInvalid()}
                    handleClick={handleSubmit}
                />
            </div>
        </div>
    );
};

JarForm.defaultProps = {
    currentUser: null
};

const mapStateToProps = ({ user, memoryJar }) => ({
    currentUser: user.currentUser,
    currentMemoryJar: memoryJar.currentMemoryJar
});

const mapDispatchToProps = dispatch => ({
    setCurrentMemoryJar: memoryJar => dispatch(setCurrentMemoryJar(memoryJar))
});

export default connect(mapStateToProps, mapDispatchToProps)(JarForm);