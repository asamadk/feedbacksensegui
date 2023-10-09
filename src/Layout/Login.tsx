import { Box, Typography } from '@mui/material'
import * as Endpoint from '../Utils/Endpoints'
import Logo from '../Components/Logo';
import GoogleSignInButton from '../Components/GoogleSignInButton';
import { useSelector } from 'react-redux';

function Login() {

    const defaultColor = useSelector((state: any) => state.colorReducer);

    const googleAuth = () => {
        window.open(
            Endpoint.getRedirectGoogleAuth(),
            '_self'
        );
    }

    const subContainerStyle = {
        width: '50%',
        margin: 'auto',
        padding: '50px 0px',
        // backgroundColor: '#1A1A1A',
        height: 'calc(100vh - 158px)',
    }

    return (
        <Box sx={{ backgroundColor: defaultColor?.backgroundColor, height: 'calc(100vh - 58px)', display: 'flex' }} >
            <Box width={'50%'}>
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    height={'calc(100vh - 100px)'}
                    overflow={'hidden'}
                    padding={'20px 40px'}
                    sx={{ backgroundColor: '#006dff' }}
                >
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
                        color={'#081213'}
                    >
                        We make sense of your feedback
                    </Typography>
                    <Typography
                        color={'#1a1a1a'}
                        textAlign={'start'}
                    >
                        Our application is designed to cut through the noise, decipher the important messages, and present you with clear, actionable insight
                    </Typography>
                </Box>
            </Box>
            <Box sx={{...subContainerStyle,backgroundColor: defaultColor?.backgroundColor}} >
                <Typography sx={{ color: '#f1f1f1', fontSize: '25px',marginTop : '30%' }} >
                    Welcome to
                    <span style={{ color: '#006DFF', marginLeft: '5px' }} >Feedback</span>Sense
                </Typography>
                <Box sx={{ width: 'fit-content', margin: 'auto', paddingTop: '20px' }} >
                    <GoogleSignInButton onClick={googleAuth} />
                </Box>
            </Box>
        </Box>
    )
}

export default Login