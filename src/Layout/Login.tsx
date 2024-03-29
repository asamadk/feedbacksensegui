import { Box, Divider, Typography } from '@mui/material'
import * as Endpoint from '../Utils/Endpoints'
import GoogleSignInButton from '../Components/GoogleSignInButton';
import MicrosoftSignInButton from '../Components/MicrosoftSignInButton';
import { colorPalette } from '../Utils/Constants';
import { useNavigate } from 'react-router';

function Login() {

    const navigate = useNavigate();

    const googleAuth = () => {
        window.open(
            Endpoint.getRedirectGoogleAuth(),
            '_self'
        );
    }

    const microsoftAuth = () => {
        window.open(
            Endpoint.getRedirectMicrosoftAuth(),
            '_self'
        )
    }

    const subContainerStyle = {
        width: '50%',
        padding: '50px 0px',
        height: 'calc(100vh - 99px)',
    }

    const handleSignUp = () => {
        navigate('/sign-up');
    }

    return (
        <Box sx={{ height: 'calc(100vh - 85px)', display: 'flex' }} >
            <Box width={'50%'}>
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    height={'calc(100vh - 89px)'}
                    overflow={'hidden'}
                    padding={'20px 40px'}
                >
                    <img src='/hero.png' alt='Hero' />
                </Box>
            </Box>
            <Box sx={{ ...subContainerStyle, backgroundColor: colorPalette.secondary,textAlign : 'center' }} >
                <Typography
                        variant='h2'
                        fontWeight={600}
                        color={colorPalette.darkBackground}
                        marginTop={'20px'}
                    >
                        Welcome, Start your journey with us
                    </Typography>
                    <Typography
                        variant='h4'
                        color={colorPalette.primary}
                    >
                        Empower Your Feedback - Intuitively, Intelligently, Affordably
                    </Typography>
                <Box sx={{ width: '250px', margin: 'auto', paddingTop: '20px' }} >
                    <GoogleSignInButton onClick={googleAuth} />
                </Box>
                <Box sx={{ width: '250px', margin: 'auto', paddingTop: '20px' }} >
                    <MicrosoftSignInButton onClick={microsoftAuth} />
                </Box>
                <Box  width={'250px'} margin={'auto'} marginTop={'20px'}>
                    <Divider style={{background : colorPalette.primary}} />
                </Box>
                <Typography
                    color={colorPalette.darkBackground}
                    marginTop={'20px'}
                >
                    Do not have an account ?
                    <span
                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={handleSignUp}
                    > Sign Up</span>
                </Typography>
            </Box>
        </Box>
    )
}

export default Login