import { Box, Button, IconButton, Typography } from '@mui/material'
import GithubButton from 'react-github-login-button';
import GoogleButton from 'react-google-button';
import GoogleIcon from '@mui/icons-material/Google';
import * as Endpoint from '../Utils/Endpoints'
import { useState } from 'react';

function Login() {

    const googleAuth = () => {
        window.open(
            Endpoint.getRedirectGoogleAuth(),
            "_target"
        );
    }

    return (
        <Box sx={{backgroundColor: '#1E1E1E',height : 'calc(100vh - 58px)', display : 'flex'}} >
            <Box sx={{width : '50%', marginTop : '15%'}} >
                <Typography sx={{color : '#f1f1f1', fontSize : '34px'}} >
                    Welcome to Feedback<span style={{color : '#FFA500'}} >Sense</span>
                </Typography>
                <Box sx={{width : 'fit-content',margin : 'auto', paddingTop : '20px'}} >
                    {/* <GoogleLoginButton /> */}
                    <GoogleButton onClick={googleAuth} type='light' style={{borderRadius : '6px'}}  />
                </Box>
            </Box>
            <Box sx={{width : '50%', borderLeft : '1px #454545 solid'}} >

            </Box>
        </Box>
    )
}

export default Login

function GoogleLoginButton(){

    const signinStyle = {
        padding : '12px 20px', 
        borderRadius : '6px', 
        border : '1px #808080 solid', 
        boxShadow: '0 0 2px rgba(23,29,26,.15)',
        cursor : 'pointer', 
        display : 'flex',
        width : '200px',
    }

    const googleAuth = () => {
        window.open(
            Endpoint.getRedirectGoogleAuth(),
            "_target"
        );
    }

    const [googleColor, setGoogleColor] = useState<any>('error');
    const googleColors = [
        'error','info','primary','secondary','success','warning'
    ]

    setInterval(() => {
        setGoogleColor(googleColors[randomIntFromInterval(0,5)])
    },1000);

    return (
        <Box justifyContent={'space-between'} onClick={googleAuth} sx={signinStyle} >
            <GoogleIcon color={googleColor} />
            <Typography color={'#808080'} >Sign in with Google</Typography>
        </Box>
    )
}

function randomIntFromInterval(min : number , max : number) : number { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}