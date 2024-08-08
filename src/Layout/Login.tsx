import { Box, Button, Divider, styled, TextField, Typography } from '@mui/material'
import * as Endpoint from '../Utils/Endpoints'
import GoogleSignInButton from '../Components/GoogleSignInButton';
import MicrosoftSignInButton from '../Components/MicrosoftSignInButton';
import { colorPalette } from '../Utils/Constants';
import { useNavigate } from 'react-router';
import { textFieldStyle } from '../Styles/InputStyles';
import { containedButton } from '../Styles/ButtonStyle';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoader } from '../Redux/Reducers/LoadingReducer';
import axios from 'axios';
import { showNotification } from '../Redux/Reducers/NotificationReducer';

const CssTextField = styled(TextField)(textFieldStyle);

function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

    const handleNoLogin = () => {
        window.open('https://www.retainsense.com/support')
    }

    async function handleLocalLogin() {
        const payload = {
            email: email,
            password: password
        }
        if(email == null || email.length < 1 || password == null || password.length < 1){
            dispatch(showNotification('Please provide email & password','warning'));
            return;
        }
        
        try{
            dispatch(setLoader(true));
            await axios.post(Endpoint.endpoints.auth.localLogin,payload,{withCredentials : true});
            window.location.reload();
            dispatch(setLoader(false));
        }catch(error :any){
            dispatch(showNotification(error?.response?.data,'error'));
            dispatch(setLoader(false));
        }
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
                    <Typography sx={{ color: colorPalette.textSecondary, fontSize: '12px' }} >
                        Reduce churn, predict customer behavior, and boost revenue with our all-in-one tool.
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ padding: '50px 50px', textAlign: 'start', width: '50%' }} >
                <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', top: '50%', transform: 'translateY(-135px)' }} >
                    <Box >
                        <Typography variant='h4' fontWeight={600} >Sign In</Typography>
                        <Typography fontSize={'small'} sx={{ color: colorPalette.fsGray }} >
                            Sign In through application of your choice!
                        </Typography>

                        <Box>
                            <CssTextField
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                size='small'
                                label='Email'
                                type='email'
                                fullWidth
                                sx={{ marginTop: '10px', width: '300px' }}
                            />
                        </Box>
                        <Box>
                            <CssTextField
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                size='small'
                                label='Password'
                                type='password'
                                fullWidth
                                sx={{ marginTop: '10px', width: '300px' }}
                            />
                        </Box>
                        <Button
                            variant='contained'
                            sx={{ ...containedButton, width: '300px' }}
                            size='small'
                            onClick={handleLocalLogin}
                        >Login</Button>
                        {/* <Box sx={{ width: '250px', paddingTop: '20px' }} >
                            <MicrosoftSignInButton onClick={microsoftAuth} />
                        </Box> */}
                        <Box marginTop={'20px'}>
                            <Divider style={{ background: colorPalette.textSecondary }} />
                        </Box>
                        <Box sx={{ width: '300px', paddingTop: '20px' }} >
                            <GoogleSignInButton onClick={googleAuth} />
                        </Box>
                        <Typography
                            fontSize={'small'}
                            textAlign={'center'}
                            marginTop={'20px'}
                        >
                            Do not have an account ?
                            <span
                                style={{ textDecoration: 'underline', cursor: 'pointer', color: colorPalette.primary }}
                                onClick={handleNoLogin}
                            > Learn More</span>
                        </Typography>
                        <Typography
                            fontSize={'small'}
                            textAlign={'center'}
                            marginTop={'5px'}
                        >
                            Redeem AppSumo coupon?
                            <span
                                style={{ textDecoration: 'underline', cursor: 'pointer', color: colorPalette.primary }}
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