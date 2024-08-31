import { Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { colorPalette } from '../Utils/Constants'
import { containedButton } from '../Styles/ButtonStyle'
import ProductUsageConnect from '../Components/ProductUsageConnect'
import CustomEventsView from '../Components/CustomEventsView'
import ExternalApps from '../Components/ExternalApps'
import { useLocation } from 'react-router'
import { useDispatch } from 'react-redux'
import { showNotification } from '../Redux/Reducers/NotificationReducer'

const listStyle = {
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
    border: `1px ${colorPalette.textSecondary} solid`,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    background: colorPalette.background,
    borderRadius: '6px',
    marginTop: '10px'
}

function CustomerHubSettingsLayout() {

    const dispatch = useDispatch();
    const [display, setDisplay] = useState(0);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    
    useEffect(() => {
        const integration = queryParams.get('integration');
        if(integration === 'google'){
            setDisplay(3);
        }
        const success = queryParams.get('success');
        if(success == 'false'){
            const message = queryParams.get('message');
            dispatch(showNotification(message,'error'));
        }
    },[])

    function handleConnectClick() {
        setDisplay(1);
    }

    function handleCustomEventClick() {
        setDisplay(2);
    }

    function handleAppClick(){
        setDisplay(3);
    }

    function DynamicDisplay() {
        if (display < 1) { return <></> }
        if (display === 1) {
            return <ProductUsageConnect back={() => setDisplay(0)} />
        }else if(display === 2){
            return <CustomEventsView back={() => setDisplay(0)} />
        }else if(display === 3){
            return <ExternalApps back={() => setDisplay(0)} />
        }
        return <></>
    }

    function MainDisplay() {
        if (display !== 0) { return <></> }
        return (
            <Box>
                <Box sx={listStyle} >
                    <Box textAlign={'start'} >
                        <Typography fontWeight={600} >Product Usage</Typography>
                        <Typography sx={{ color: colorPalette.fsGray, fontSize: '13px' }} >
                            Automate your data streaming to RetainSense by using RetainSense's own tracking system
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            size='small'
                            sx={containedButton}
                            onClick={handleConnectClick}
                        >Connect</Button>
                    </Box>
                </Box>
                <Box sx={listStyle} >
                    <Box textAlign={'start'} >
                        <Typography fontWeight={600} >Custom Events</Typography>
                        <Typography sx={{ color: colorPalette.fsGray, fontSize: '13px' }} >
                            View/Edit & Create custom events to personalize the tracking & improve analysis
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            size='small'
                            sx={containedButton}
                            onClick={handleCustomEventClick}
                        >View</Button>
                    </Box>
                </Box>
                <Box sx={listStyle} >
                    <Box textAlign={'start'} >
                        <Typography fontWeight={600} >Integrations</Typography>
                        <Typography sx={{ color: colorPalette.fsGray, fontSize: '13px' }} >
                            Connect your external apps with RetainSense
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            size='small'
                            sx={containedButton}
                            onClick={handleAppClick}
                        >View</Button>
                    </Box>
                </Box>
            </Box>
        )
    }

    return (
        <>
            {MainDisplay()}
            {DynamicDisplay()}
        </>
    )
}

export default CustomerHubSettingsLayout