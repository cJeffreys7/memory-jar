import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/material';

const DialogModal = ({ isOpen, title, description, confirmText, cancelText, confirmHandleClick, cancelHandleClick }) => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#000000'
            },
        }
    })
    
    return (
        <ThemeProvider theme={theme}>
            <Dialog
                open={isOpen}
                onClose={cancelHandleClick}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {title ? title : ''}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {description ? description : ''}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button color='error' onClick={confirmHandleClick}>{confirmText ? confirmText : 'Yes'}</Button>
                <Button onClick={cancelHandleClick} autoFocus>
                    {cancelText ? cancelText : 'No'}
                </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
};

export default DialogModal;