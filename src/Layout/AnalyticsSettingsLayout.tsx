import React from 'react'
import { useNavigate } from 'react-router';
import { colorPalette } from '../Utils/Constants';
import { Box, Button, Typography } from '@mui/material';
import { containedButton } from '../Styles/ButtonStyle';

const listStyle = {
  boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
  border: `1px ${colorPalette.textSecondary} solid`,
  display: 'flex',
  justifyContent: 'space-between',
  padding: '40px',
  background: colorPalette.background,
  borderRadius: '6px'
}

function AnalyticsSettingsLayout() {
  const navigate = useNavigate();

    function handleConnectClick(){
        navigate('/settings/custom-events-view');
    }

    return (
        <Box>
            <Box sx={listStyle} >
                <Box textAlign={'start'} >
                    <Typography variant='h5' fontWeight={550} >Custom Events</Typography>
                    <Typography sx={{ color: colorPalette.fsGray }} >
                      View/Edit & Create custom events to personalize the tracking & improve analysis
                    </Typography>
                </Box>
                <Box>
                    <Button
                        size='small' 
                        sx={containedButton} 
                        onClick={handleConnectClick}
                    >View</Button>
                </Box>
            </Box>
        </Box>
    )
}

export default AnalyticsSettingsLayout