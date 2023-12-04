import { Alert, AlertColor, IconButton, Snackbar, ThemeProvider, Tooltip, Typography, createTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, forwardRef, useImperativeHandle } from "react";


const Notification = forwardRef((props: any, ref) => {
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<AlertColor>('info');

    useImperativeHandle(ref, () => ({
        show(message: string, type: AlertColor) {
            setMessage(message);
            setType(type);
            setShowSnackbar(true);
            setTimeout(() => {
                setShowSnackbar(false);
            }, 4000);
        },
    }));

    const lightTheme = createTheme({
        palette: {
            mode: 'light',
        },
        typography: {
            fontFamily: 'Apercu Pro, sans-serif'
        }
    });

    return (
        <ThemeProvider theme={lightTheme} >
            <Snackbar
                title={message}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={showSnackbar}
                onClose={() => setShowSnackbar(false)}
            >
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
                    <Typography fontSize={15} >
                        {message.substring(0, 50)}
                    </Typography>
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
});

export default Notification;