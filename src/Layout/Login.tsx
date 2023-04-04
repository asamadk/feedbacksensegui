import { Box, Button, IconButton, Typography } from '@mui/material'
import GithubButton from 'react-github-login-button';
import GoogleButton from 'react-google-button';
import * as Endpoint from '../Utils/Endpoints'

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
                    <GoogleButton style={{borderRadius : '6px'}} type='light' onClick={googleAuth} ></GoogleButton>
                    <GithubButton style={{borderRadius : '6px', marginTop : '15px'}} type='light' onClick={() => { console.log('Github button clicked') }}/>
                </Box>
            </Box>
            <Box sx={{width : '50%', borderLeft : '1px #454545 solid'}} >

            </Box>
        </Box>
    )
}

export default Login