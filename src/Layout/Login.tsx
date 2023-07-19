import { Box, Typography } from '@mui/material'
import GoogleButton from 'react-google-button';
import * as Endpoint from '../Utils/Endpoints'
import Logo from '../Components/Logo';

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
                <Typography sx={{ color: '#f1f1f1', fontSize: '25px', marginTop: '25%' }} >
                    Welcome to
                    <span style={{ color: '#006DFF', marginLeft: '5px' }} >Feedback</span>Sense
                </Typography>
                <Box sx={{ width: 'fit-content', margin: 'auto', paddingTop: '20px' }} >
                    <GoogleButton type='light' onClick={googleAuth} style={{ borderRadius: '6px' }} />
                </Box>
            </Box>
            <Box width={'50%'} >
                <Box overflow={'hidden'}  >
                    <img style={{ width: '800px' }} alt='Banner' src='/banner.png' ></img>
                    {/* <img
                        className='image-shadow'
                        style={{ borderRadius: '10px', marginTop: '0px' }}
                        width={'60%'}
                        alt='Hero'
                        src='/analysis5.png' 
                    /> */}
                </Box>
            </Box>
        </Box>
    )
}

export default Login