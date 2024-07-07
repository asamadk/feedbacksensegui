import { Alert, AlertColor, IconButton, Snackbar, ThemeProvider, Tooltip, Typography, createTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { hideNotification } from "../Redux/Reducers/NotificationReducer";

function GlobalAlert() {

    const dispatch = useDispatch();
    const notification = useSelector((state: any) => state.notification);

    const handleClose = () => {
        dispatch(hideNotification());
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={notification?.message != null}
            onClose={handleClose}
            autoHideDuration={3000}
        >
            <Alert severity={notification?.status} sx={{ width: '100%' }} action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={handleClose}
                >
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            } >
                <Typography fontSize={15} >
                    {notification?.message}
                </Typography>
            </Alert>
        </Snackbar>
    )
}

export default GlobalAlert