import { Box, Button, Card, CardActions, CardContent, CardMedia, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { colorPalette } from '../Utils/Constants';
import { globalSettingSubContainers } from '../Styles/LayoutStyles';
import { containedButton } from '../Styles/ButtonStyle';
import { useDispatch } from 'react-redux';
import { setLoader } from '../Redux/Reducers/LoadingReducer';
import { showNotification } from '../Redux/Reducers/NotificationReducer';
import { getAPIErrorMessage } from '../Utils/FeedbackUtils';
import axios from 'axios';
import { endpoints } from '../Utils/Endpoints';

type propType = {
    back: any
}

function ExternalApps(props: propType) {

    const dispatch = useDispatch();
    const [googleConnected, setGoogleConnected] = useState(false);

    let init = false;
    useEffect(() => {
        if (init === true) { return; }
        getGoogleConnectionStatus();
        init = true;
    }, []);

    async function getGoogleConnectionStatus() {
        try {
            dispatch(setLoader(true));
            const { data } = await axios.get(endpoints.integration.checkGoogleStatus, { withCredentials: true });
            if (data.data) {
                const exists = data.data.exists;
                setGoogleConnected(exists);
            }
            dispatch(setLoader(false));
        } catch (error) {
            dispatch(setLoader(false));
            dispatch(showNotification(getAPIErrorMessage(error), 'error'));
        }
    }

    async function handleGoogleConnect() {
        try {
            dispatch(setLoader(true));
            const { data } = await axios.get(endpoints.integration.googleAuthURL, { withCredentials: true });
            if (data.data) {
                window.open(data.data,'_self');
            } else {
                dispatch(showNotification('Something went wrong', 'error'));
            }
            dispatch(setLoader(false));
        } catch (error) {
            dispatch(setLoader(false));
            dispatch(showNotification(getAPIErrorMessage(error), 'error'));
        }
    }

    async function handleGoogleDisconnect(){
        try {
            dispatch(setLoader(true));
            const { data } = await axios.get(endpoints.integration.googleDisconnectAuth, { withCredentials: true });
            dispatch(showNotification(data.message, 'success'));
            dispatch(setLoader(false));
            setGoogleConnected(false);
        } catch (error) {
            dispatch(setLoader(false));
            dispatch(showNotification(getAPIErrorMessage(error), 'error'));
        }
    }

    function AppBlock() {
        return <>
            <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                    component="img"
                    alt="Gmail"
                    sx={{ m: 'auto', width: '50%', height: '130px' }}
                    image="/gmail.png"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Gmail
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Integrate Gmail with RetainSense & automate your workflow like never before.
                    </Typography>
                </CardContent>
                <CardActions>
                    {
                        googleConnected ?
                        <Button
                            sx={{ ...containedButton, marginTop: 0,background : '#ba000d' }}
                            size="small"
                            onClick={handleGoogleDisconnect}
                        >Disconnect</Button> :
                        <Button
                            sx={{ ...containedButton, marginTop: 0 }}
                            size="small"
                            onClick={handleGoogleConnect}
                        >Connect</Button>
                    }
                </CardActions>
            </Card>
        </>
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'start', marginBottom: '10px' }} >
                <IconButton onClick={() => props.back()}  >
                    <ArrowBackIcon sx={{ color: colorPalette.darkBackground }} />
                </IconButton>
                <Typography variant='h6' marginTop={'4px'} >Integrations</Typography>
            </Box>
            <Box>
                {AppBlock()}
            </Box>
        </Box>
    )
}

export default ExternalApps