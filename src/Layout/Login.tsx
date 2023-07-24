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
                <Box 
                    display={'flex'}
                    flexDirection={'column'}
                    // justifyContent={'center'}
                    height={'calc(100vh - 100px)'}
                    overflow={'hidden'}  
                    padding={'20px 40px'} 
                    sx={{backgroundColor : '#1A1A1A'}} 
                >
                    <img style={{ width: '150px',margin : '0 auto' }} alt='Banner' src='/logofeedback.png' ></img>
                    <Typography 
                        variant='h2'
                        fontWeight={600}
                        textAlign={'start'} 
                        color={'#f1f1f1'} 
                    >
                        Welcome, Start your journey with us
                    </Typography>
                    <Typography 
                        variant='h4' 
                        textAlign={'start'} 
                        color={'#006dff'} 
                    >
                        We make sense of your feedback
                    </Typography>
                    <Typography
                        color={'#808080'} 
                        textAlign={'start'} 
                    >
                    Our application is designed to cut through the noise, decipher the important messages, and present you with clear, actionable insight
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default Login