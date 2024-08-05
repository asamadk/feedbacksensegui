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

    //TODO redirect to book a meeting
    const handleNoLogin = () => {
        window.open('https://www.retainsense.com/support')
    }

    return (
        <Box sx={{ display: 'flex' }} >
            <Box width={'50%'}>
                <Box
                    sx={{ background: colorPalette.primary }}
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    height={'calc(100vh - 39px)'}
                    overflow={'hidden'}
                    padding={'20px 40px'}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center' }} >
                        <img style={{ width: '50px', marginRight: '10px' }} src='/logo-churn.png' alt='RetainSense' />
                        <Typography sx={{ fontSize: '25px', fontWeight: '600', color: 'white', marginTop: '6px' }} >
                            RetainSense
                        </Typography>
                    </Box>
                    <Typography sx={{color : colorPalette.textSecondary,fontSize : '12px'}} >
                        Reduce churn, predict customer behavior, and boost revenue with our all-in-one tool.
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ padding: '50px 50px', textAlign: 'start', width: '50%' }} >
                <Box sx={{display : 'flex',justifyContent : 'center', position : 'relative',top : '50%',transform: 'translateY(-135px)'}} >
                    <Box >
                        <Typography variant='h3' fontWeight={600} >Sign In</Typography>
                        <Typography sx={{ width: '80%' }} >
                            Sign In through application of your choice!
                        </Typography>
                        <Box sx={{ width: '250px', paddingTop: '20px' }} >
                            <GoogleSignInButton onClick={googleAuth} />
                        </Box>
                        <Box sx={{ width: '250px', paddingTop: '20px' }} >
                            <MicrosoftSignInButton onClick={microsoftAuth} />
                        </Box>
                        <Box marginTop={'20px'}>
                            <Divider style={{ background: colorPalette.fsGray, width: '80%' }} />
                        </Box>
                        <Typography
                            marginTop={'20px'}
                        >
                            Do not have an account ?
                            <span
                                style={{ textDecoration: 'underline', cursor: 'pointer',color : colorPalette.primary }}
                                onClick={handleNoLogin}
                            > Learn More</span>
                        </Typography>
                        <Typography
                            marginTop={'5px'}
                        >
                            Redeem AppSumo coupon?
                            <span
                                style={{ textDecoration: 'underline', cursor: 'pointer',color : colorPalette.primary }}
                                onClick={() => navigate('/redeem/appsumo')}
                            >
                                Click Here
                            </span>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Login