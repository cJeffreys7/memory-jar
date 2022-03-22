import React from 'react';
import { TextField } from '@mui/material';

const FormInput = ({ className, name, type, label, placeholder, error, helperText, value, onChange, multiline, rows, variant, sx }) => {
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
            sx = {sx}
        />
    );
};

export default FormInput;