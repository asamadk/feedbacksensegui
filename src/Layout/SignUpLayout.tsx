import { Box, Divider, Typography } from '@mui/material'
import * as Endpoint from '../Utils/Endpoints'
import GoogleSignInButton from '../Components/GoogleSignInButton';
import MicrosoftSignInButton from '../Components/MicrosoftSignInButton';
import { colorPalette } from '../Utils/Constants';
import { useNavigate } from 'react-router';

function SignUpLayout() {

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
        height: 'calc(100vh - 149px)',
    }

    const handleLogin = () => {
        navigate('/login');
    }

    return (
        <Box sx={{ height: 'calc(100vh - 45px)', display: 'flex' }} >
            <Box width={'50%'}>
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    height={'calc(100vh - 89px)'}
                    overflow={'hidden'}
                    padding={'20px 40px'}
                    sx={{ backgroundColor: colorPalette.darkBackground }}
                >
                    <Typography
                        variant='h2'
                        fontWeight={600}
                        textAlign={'start'}
                        color={'#f1f1f1'}
                    // color={colorPalette.secondary}
                    >
                        Welcome, Start your journey with us
                    </Typography>
                    <Typography
                        variant='h4'
                        textAlign={'start'}
                        color={colorPalette.primary}
                    >
                        Empower Your Feedback - Intuitively, Intelligently, Affordably
                    </Typography>
                    <Typography
                        color={colorPalette.fsGray}
                        textAlign={'start'}
                    >
                        Our application is designed to cut through the noise,
                        decipher the important messages, and present you with clear,
                        actionable insight
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ ...subContainerStyle, backgroundColor: colorPalette.darkBackground }} >
                <Box sx={{ width: '250px', margin: 'auto', paddingTop: '20px', marginTop: '30%' }} >
                    <GoogleSignInButton onClick={googleAuth} />
                </Box>
                <Box sx={{ width: '250px', margin: 'auto', paddingTop: '20px' }} >
                    <MicrosoftSignInButton onClick={microsoftAuth} />
                </Box>
                <Box width={'250px'} margin={'auto'} marginTop={'20px'}>
                    <Divider style={{background : colorPalette.primary}} />
                </Box>
                <Typography
                    color={colorPalette.secondary}
                    marginTop={'20px'}
                    textAlign={'center'}
                >
                    Already have an account ?
                    <span
                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={handleLogin}
                    > Login</span>
                </Typography>
            </Box>
        </Box>
    )

}

export default SignUpLayout