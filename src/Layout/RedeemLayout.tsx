import { Box, Button, Divider, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { colorPalette } from '../Utils/Constants'
import styled from '@emotion/styled';
import { textFieldStyle } from '../Styles/InputStyles';
import { containedButton } from '../Styles/ButtonStyle';
import { useDispatch } from 'react-redux';
import { showNotification } from '../Redux/Reducers/NotificationReducer';
import { setLoader } from '../Redux/Reducers/LoadingReducer';
import axios from 'axios';
import { endpoints } from '../Utils/Endpoints';
import { useNavigate } from 'react-router';

const CssTextField = styled(TextField)(textFieldStyle);

function RedeemLayout() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [coupon, setCoupon] = useState('');
    const [name, setName] = useState('');
    const [orgName, setOrgName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function applyCoupon() {
        const payload = {
            name: name,
            coupon: coupon,
            orgName: orgName,
            email: email,
            password : password
        }
        if (
            email == null || email.length < 1 ||
            orgName == null || orgName.length < 1 ||
            coupon == null || coupon.length < 1 ||
            name == null || name.length < 1 ||
            password == null || password.length < 1
        ) {
            dispatch(showNotification('Please fill all values', 'error'));
            return;
        }
        try {
            dispatch(setLoader(true));
            const { data } = await axios.post(endpoints.auth.appSumoCoupon, payload);
            dispatch(showNotification(data?.message, 'success'));
            navigate('/login')
            dispatch(setLoader(false));
        } catch (error: any) {
            dispatch(showNotification(error?.response?.data?.message, 'error'));
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
                    <Box width={'60%'} margin={'10px auto'} textAlign={'start'} >
                        <Typography sx={{ color: colorPalette.textSecondary, fontSize: '16px' }} >
                            <b>Redemption Instructions</b>
                        </Typography>
                        <Typography sx={{ color: colorPalette.textSecondary, fontSize: '14px', marginTop: '5px' }} >
                            <b>1.</b> Enter your details along with your AppSumo coupon code
                        </Typography>
                        <Typography sx={{ color: colorPalette.textSecondary, fontSize: '14px', marginTop: '5px' }} >
                            <b>2.</b> Click on "Apply Coupon"
                        </Typography>
                        <Typography sx={{ color: colorPalette.textSecondary, fontSize: '14px', marginTop: '5px' }} >
                            <b>3.</b> You will be redirected to RetainSense's Login Page
                        </Typography>
                        <Typography sx={{ color: colorPalette.textSecondary, fontSize: '14px', marginTop: '5px' }} >
                            <b>4.</b> Login using you oauth provider
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ padding: '50px 50px', textAlign: 'start', width: '50%', margin: 'auto' }} >
                <Box textAlign={'center'} >
                    <img style={{ width: '200px' }} src='/appsumo.png' alt='appsumo' />
                </Box>
                <Box width={'50%'} margin={'auto'}>
                    <CssTextField
                        sx={{ marginTop: '40px' }}
                        size='small'
                        label='Organization Name'
                        fullWidth
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                    />
                    <br />
                    <CssTextField
                        sx={{ marginTop: '10px' }}
                        size='small'
                        label='Your Name'
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <br />
                    <CssTextField
                        sx={{ marginTop: '10px' }}
                        size='small'
                        label='Email'
                        type='email'
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <br />
                    <CssTextField
                        sx={{ marginTop: '10px' }}
                        size='small'
                        label='Password'
                        type='password'
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    <CssTextField
                        sx={{ marginTop: '10px' }}
                        size='small'
                        label='AppSumo Code'
                        fullWidth
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                    />
                    <Button
                        onClick={applyCoupon}
                        sx={containedButton}
                    >
                        Apply Coupon
                    </Button>
                    <Typography
                            fontSize={'small'}
                            textAlign={'center'}
                            marginTop={'5px'}
                        >
                            Visit login page? 
                            <span
                                style={{ textDecoration: 'underline', cursor: 'pointer', color: colorPalette.primary }}
                                onClick={() => navigate('/login')}
                            >
                                Click Here
                            </span>
                        </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default RedeemLayout