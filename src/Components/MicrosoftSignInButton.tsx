import React from 'react';
import { Button } from '@mui/material';

const useStyles: any = {
    backgroundColor: '#ffffff',
    color: '#1e1e1e',
    width: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
    '&:hover': {
        backgroundColor: '#E5E4E2',
        color: '#454545'
    },
};

const MicrosoftSignInButton = (props: any) => {

    const handleSignIn = () => {
        props.onClick();
    };

    return (
        <Button
            variant="contained"
            sx={useStyles}
            onClick={handleSignIn}
            startIcon={
                <img src="/Microsoft.png" alt="Microsoft Logo" style={{ height: '24px', width: '24px' }} />
            }
        >
            Sign in with Microsoft
        </Button>
    );
};

export default MicrosoftSignInButton;
