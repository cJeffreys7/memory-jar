import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import './styles.scss'

const Dropzone = ({ canEdit, defaultImg, handleAddFile }) => {
    const [image, setImage] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        console.log('File: ', file);
        handleAddFile(file);
        setImage(URL.createObjectURL(file));
        // eslint-disable-next-line
    }, []);

    // isDragActive is another deconstructed prop from useDropzone
    const { getRootProps, getInputProps } = useDropzone({onDrop});

    return (
        <div className='dropzone-wrapper'>
            {canEdit ? 
                <div className='dropzone-root' {...getRootProps()}>
                    <input {...getInputProps()} />
                    <img className='file-edit-preview' src={image ? image : defaultImg} alt="Uploaded file preview" />
                    <p className='dropzone-text'>Drag 'n' drop some files here, or click to select files</p>
                </div>
            :
                <div className='dropzone-root'>
                    <img className='file-preview' src={image ? image : defaultImg} alt="File preview" />
                </div>
            }
        </div>
    );
};

export default Dropzone;