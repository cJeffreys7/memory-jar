import React from 'react';
import { TextField } from '@mui/material';

const FormInput = ({ className, name, type, label, placeholder, error, helperText, value, onChange, multiline, rows, variant }) => {
    return (
        <TextField
            className={className}
            name={name}
            type={type}
            label={label}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            value={value}
            onChange={onChange}
            multiline={multiline}
            rows={rows ? rows : 1}
            variant={variant}
            sx = {{
                maxWidth: 1280,
            }}
        />
    );
};

export default FormInput;