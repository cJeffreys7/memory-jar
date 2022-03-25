import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTheme } from '@mui/material';
import { connect } from 'react-redux';
import { setCurrentPath } from '../../redux/Path/pathActions';

// components
import Dropzone from '../../components/Dropzone';
import FormInput from '../../components/FormInput';
import Button from '../../components/MUI/StyledButton';

// services
import * as memoryJarService from '../../services/memoryJarService';

// assets
import DefaultImg from '../../assets/memoryjar_logo.svg';

import './styles.scss';
import variables from '../../styles.scss';

const initialErrors = {};

const MemoryForm = (props) => {
    const navigate = useNavigate();
    const { currentMemoryJar, setCurrentPath } = props;
    const { id, memoryId } = useParams();
    const [errors, setErrors] = useState(initialErrors);
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [file, setFile] = useState(null);
    const [defaultImg, setDefaultImg] = useState(DefaultImg);

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

    const handleAddFile = file => {
        console.log(file);
        setFile(file);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        let result;
        if (currentMemoryJar) {
            result = await memoryJarService.updateMemory(
                id, formData
            );
        } else {
            console.log('Current time: ', Math.trunc(Date.now()/1000));
            const formattedFormData = {
                ...formData,
                isFavorited: false,
                timestamp: Math.trunc(Date.now()/1000)
            };
            result = await memoryJarService.saveMemory(
                id, formattedFormData, file
            );
        };
        if (result) navigate(-1);
    };

    const { title, description } = formData;
    const {
        titleEntry,
        titleError,
        titleHelperText,
        descriptionEntry,
        descriptionError,
        descriptionHelperText
    } = errors;

    const titleValidation = () => {
        let error = {};
        if (!title) {
            error = {
                titleError: true,
                titleHelperText: 'Please enter a name for this Memory'
            };
        } else {
            error = {
                titleError: false
            };
        };
        return error;
    };

    const descriptionValidation = () => {
        let error = {};
        if (!description) {
            error = {
                descriptionError: true,
                descriptionHelperText: 'Please enter a description for this Memory'
            };
        } else {
            error = {
                descriptionError: false
            };
        };
        return error;
    };

    const isFormInvalid = () => {
        return !(title && description && (file || currentMemoryJar));
    };

    useEffect(() => {
        if (currentMemoryJar && memoryId) {
            const memory = currentMemoryJar.memories.find(
                memory => memory.filename === memoryId
            );
            setDefaultImg(`https://memoryjar-springboot.herokuapp.com/jars/${id}/memories/${memoryId}`);
            setFormData({
                ...memory
            });
        };

        setCurrentPath(currentMemoryJar ? 'Memories/Edit' : 'Memories/New');
        // eslint-disable-next-line
    }, [currentMemoryJar]);

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
        };

        formCheck();
        // eslint-disable-next-line
    }, [title, description]);

    const theme = createTheme({
        palette: {
            primary: {
                main: variables.callToActionColor
            },
        }
    });

    return (
        <div className='memory-form-wrapper'>
            <form className='memory-form' onSubmit={handleSubmit}>
                <FormInput 
                    className='input'
                    name='title'
                    type='text'
                    label='New Memory Name'
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
                <Dropzone
                    canEdit={currentMemoryJar ? false : true}
                    defaultImg={defaultImg}
                    handleAddFile={handleAddFile}
                />
                <Button
                    theme={theme}
                    type='submit'
                    label='Submit'
                    disabled={isFormInvalid()}
                />
            </form>
        </div>
    );
};

MemoryForm.defaultProps = {
    currentUser: null,
    currentMemoryJar: null,
    currentPath: null
};

const mapStateToProps = ({ memoryJar, path }) => ({
    currentMemoryJar: memoryJar.currentMemoryJar,
    currentPath: path.currentPath
});

const mapDispatchToProps = dispatch => ({
    setCurrentPath: path => dispatch(setCurrentPath(path))
})

export default connect(mapStateToProps, mapDispatchToProps)(MemoryForm);