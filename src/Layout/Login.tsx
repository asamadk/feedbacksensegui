import { Box, Typography } from '@mui/material'
import GoogleButton from 'react-google-button';
import * as Endpoint from '../Utils/Endpoints'

function Login() {

    const googleAuth = () => {
        window.open(
            Endpoint.getRedirectGoogleAuth(),
            "_target"
        );
    }

    const subContainerStyle = {
        width: '35%',
        margin: 'auto',
        marginTop: '15%',
        border: '1px #454545 solid',
        borderRadius: '6px',
        padding: '50px 0px',
        backgroundColor: '#1A1A1A'
    }

    return (
        <Box sx={{ backgroundColor: '#1E1E1E', height: 'calc(100vh - 58px)', display: 'flex' }} >
            <Box sx={subContainerStyle} >
                <Typography sx={{ color: '#f1f1f1', fontSize: '34px' }} >
                    Welcome to Feedback<span style={{ color: '#FFA500' }} >Sense</span>
                </Typography>
                <Box sx={{ width: 'fit-content', margin: 'auto', paddingTop: '20px' }} >
                    <GoogleButton onClick={googleAuth} type='light' style={{ borderRadius: '6px' }} />
                </Box>
            </Box>
        </Box>
    )
}

export default Login