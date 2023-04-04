import React, { useEffect } from 'react'
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';


function CustomAlert(props: any) {

    const [open, setOpen] = React.useState(props.open);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setOpen(false);
    //     },3000);
    // },[]);

    return (
        <>
            {
                open &&
                <Box>
                    <Alert
                        severity={props.type}
                        sx={{ mb: 2 }}
                    >
                        {props.message}
                    </Alert>
                </Box>
            }
        </>
    )
}

export default CustomAlert