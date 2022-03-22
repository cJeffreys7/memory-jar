import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { createTheme } from '@mui/material';

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
    const { currentMemoryJar } = props;
    const { id, memoryId } = useParams();
    const [errors, setErrors] = useState(initialErrors);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        isFavorited: false
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
            result = await memoryJarService.saveMemory(
                id, formData, file
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
        let memory;
        if (currentMemoryJar && memoryId) {
            memory = currentMemoryJar.memories.find(
                memory => memory.filename === memoryId
            );
            setDefaultImg(`https://memoryjar-springboot.herokuapp.com/jars/${id}/memories/${memoryId}`);
            setFormData({
                ...memory
            });
        };
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
    currentUser: null
};

const mapStateToProps = ({ memoryJar }) => ({
    currentMemoryJar: memoryJar.currentMemoryJar
});

export default connect(mapStateToProps, null)(MemoryForm);