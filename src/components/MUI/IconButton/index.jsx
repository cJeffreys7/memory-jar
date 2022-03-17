import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material';

function IconButton({ theme, color, icon, handleClick, isPressed }) {
    const [pressed, setPressed] = useState(false);

    const onClick = () => {
        // if (isPressed === null) setPressed(!pressed);
        if (isPressed === null) {
            console.log('isPressed is null, use pressed state instead');
            setPressed(!pressed)
        };
        if (handleClick) handleClick();
    }

    const defaultTheme = createTheme({
        palette: {
            primary: {
                main: '#000000'
            },
            secondary: {
                main: '#000000'
            }
        }
    })

    return (
        <ThemeProvider theme={theme ? theme : defaultTheme}>
            <Button
                color={color ? color : isPressed !== null ? isPressed ? "primary" : "secondary" : pressed ? "primary" : "secondary"}
                onClick={onClick}
            >
                {icon && icon}
            </Button>
        </ThemeProvider>
    );
}

export default IconButton;