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
        padding: '50px 50px',
        height: 'calc(100vh - 99px)',
    }

    const handleSignUp = () => {
        navigate('/sign-up');
    }

    return (
        <Box sx={{ height: 'calc(100vh - 85px)', display: 'flex' }} >
            <Box sx={{ ...subContainerStyle, backgroundColor: colorPalette.primary, textAlign: 'start',width : '25%' }} >
                <Box sx={{width : 'fit-content',position : 'absolute',top : '50%',transform : 'translateY(-50%)'}} >
                    <Typography sx={{color : 'white'}} variant='h3' fontWeight={600} >Sign In</Typography>
                    <Typography sx={{color : colorPalette.background,width : '80%'}} >
                        Sign In through application of your choice!
                    </Typography>
                    <Box sx={{ width: '250px', paddingTop: '20px' }} >
                        <GoogleSignInButton onClick={googleAuth} />
                    </Box>
                    <Box sx={{ width: '250px', paddingTop: '20px' }} >
                        <MicrosoftSignInButton onClick={microsoftAuth} />
                    </Box>
                    <Box marginTop={'20px'}>
                        <Divider style={{ background: colorPalette.fsGray,width : '80%' }} />
                    </Box>
                    <Typography
                        color={colorPalette.background}
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
            <Box width={'75%'}>
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    height={'calc(100vh - 89px)'}
                    overflow={'hidden'}
                    padding={'20px 40px'}
                >
                    <img style={{maxWidth : '70%',margin : 'auto'}} src='/hero.png' alt='Hero' />
                </Box>
            </Box>
        </Box>
    )
}

export default Login