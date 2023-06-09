import { Box, Typography } from '@mui/material'
import GoogleButton from 'react-google-button';
import * as Endpoint from '../Utils/Endpoints'

function Login() {

    const googleAuth = () => {
        window.open(
            Endpoint.getRedirectGoogleAuth(),
            '_self'
        );
    }

    const subContainerStyle = {
        width: '50%',
        margin: 'auto',
        borderRight: '1px #454545 solid',
        padding: '50px 0px',
        backgroundColor: '#1A1A1A',
        height: 'calc(100vh - 158px)'
    }

    return (
        <Box sx={{ backgroundColor: '#1E1E1E', height: 'calc(100vh - 58px)', display: 'flex' }} >
            <Box sx={subContainerStyle} >
                <Typography sx={{ color: '#f1f1f1', fontSize: '25px',marginTop : '25%' }} >
                    Welcome to Feedback<span style={{ color: '#f3d503' }} >Sense</span>
                </Typography>
                <Box sx={{ width: 'fit-content', margin: 'auto', paddingTop: '20px' }} >
                    <GoogleButton type='light' onClick={googleAuth} style={{ borderRadius: '6px' }} />
                </Box>
            </Box>
            <Box width={'50%'} ></Box>
        </Box>
    )
}

export default Login