import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { colorPalette } from '../Utils/Constants'
import { containedButton } from '../Styles/ButtonStyle'
import { useNavigate } from 'react-router'

const listStyle = {
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
    border: `1px ${colorPalette.textSecondary} solid`,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '40px',
    background: colorPalette.background,
    borderRadius: '6px'
}

function CustomerHubSettingsLayout() {

    const navigate = useNavigate();

    function handleConnectClick(){
        navigate('/settings/product-usage-connect');
    }

    return (
        <Box>
            <Box sx={listStyle} >
                <Box textAlign={'start'} >
                    <Typography variant='h5' fontWeight={550} >Product Usage</Typography>
                    <Typography sx={{ color: colorPalette.fsGray }} >
                        Automate your data streaming to feedbacksense by using feedbacksense's own tracking system
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
        </Box>
    )
}

export default CustomerHubSettingsLayout