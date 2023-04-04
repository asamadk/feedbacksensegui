import { Alert, AlertColor, IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, forwardRef, useImperativeHandle } from "react";


const Notification = forwardRef((props: any, ref) => {
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<AlertColor>('info');

    useImperativeHandle(ref, () => ({
        show(message: string, type : AlertColor) {
            setMessage(message);
            setType(type);
            setShowSnackbar(true);
            setTimeout(() => {
                setShowSnackbar(false);
            }, 7000);
        },
    }));
    return (
        <Snackbar open={showSnackbar} onClose={() => setShowSnackbar(false)}>
            <Alert severity={type} sx={{ width: '100%' }} action={
                <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                    setShowSnackbar(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            } >
                {message}
            </Alert>
        </Snackbar>
    );
});

export default Notification;