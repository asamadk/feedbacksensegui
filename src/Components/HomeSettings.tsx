import { Box, Grid, Typography } from '@mui/material'
import { globalSettingSubContainers } from '../Styles/LayoutStyles'
import React from 'react'
import { colorPalette, settingIds } from '../Utils/Constants'

import RouteIcon from '@mui/icons-material/Route';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import WarningIcon from '@mui/icons-material/Warning';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';

const blockStyle = {
    borderRadius: '6px',
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
    padding: '20px',
    background: colorPalette.textSecondary,
    height: '110px',
    textAlign: 'start',
    display: 'flex',
    cursor: 'pointer'
}

const subBlockStyle = {
    background: colorPalette.secondary,
    borderRadius: '10px',
    padding: '20px',
    width: '15%',
    textAlign: 'center',
    color: colorPalette.primary,
    margin: 'auto 0px'
}

function HomeSettings(props : {click :any}) {
    return (
        <Box sx={{ ...globalSettingSubContainers('#ffffff'), height: 'calc(100vh - 80px)', overflowY: 'auto' }} >
            <Box sx={{ textAlign: 'start' }} >
                <Typography fontWeight={600} variant='h6' >Home</Typography>
                <Typography sx={{ fontSize: '13px', color: colorPalette.fsGray }} >
                    To get the most out of feedbacksense, please use these quick links
                </Typography>
            </Box>

            <Box marginTop={'20px'} >
                <Grid container spacing={2} >
                    <Grid item xs={6} >
                        <Box onClick={() => props.click(settingIds.DATA_MODELER)} sx={blockStyle} >
                            <Box sx={subBlockStyle} >
                                <RouteIcon sx={{ margin: 'auto' }} fontSize='large' />
                            </Box>
                            <Box margin={'auto 10px'} >
                                <Typography fontWeight={600} >Customer Journey Stages</Typography>
                                <Typography fontSize={'13px'} >Customise your customer journey stages</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6} >
                        <Box onClick={() => props.click(settingIds.DATA_MODELER)} sx={blockStyle} >
                            <Box sx={subBlockStyle} >
                                <FlagCircleIcon sx={{ margin: 'auto' }} fontSize='large' />
                            </Box>
                            <Box margin={'auto 10px'} >
                                <Typography fontWeight={600} >Onboarding Stages</Typography>
                                <Typography fontSize={'13px'} >Customise your onboarding stages</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6} >
                        <Box onClick={() => props.click(settingIds.TEAM)} sx={blockStyle} >
                            <Box sx={subBlockStyle} >
                                <GroupAddIcon sx={{ margin: 'auto' }} fontSize='large' />
                            </Box>
                            <Box margin={'auto 10px'} >
                                <Typography fontWeight={600} >Invite Teammate</Typography>
                                <Typography fontSize={'13px'} >Invite your team to join feedbacksense</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6} >
                        <Box onClick={() => props.click(settingIds.HEALTH_DESIGNER)} sx={blockStyle} >
                            <Box sx={subBlockStyle} >
                                <MonitorHeartIcon sx={{ margin: 'auto' }} fontSize='large' />
                            </Box>
                            <Box margin={'auto 10px'} >
                                <Typography fontWeight={600} >Design Health</Typography>
                                <Typography fontSize={'13px'} >Customise how do you calculate health</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6} >
                        <Box onClick={() => props.click(settingIds.DATA_MODELER)} sx={blockStyle} >
                            <Box sx={subBlockStyle} >
                                <WarningIcon sx={{ margin: 'auto' }} fontSize='large' />
                            </Box>
                            <Box margin={'auto 10px'} >
                                <Typography fontWeight={600} >Risk Stages</Typography>
                                <Typography fontSize={'13px'} >Customise your risk stages</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6} >
                    <Box onClick={() => props.click(settingIds.TICKET)} sx={blockStyle} >
                            <Box sx={subBlockStyle} >
                                <LiveHelpIcon sx={{ margin: 'auto' }} fontSize='large' />
                            </Box>
                            <Box margin={'auto 10px'} >
                                <Typography fontWeight={600} >Support</Typography>
                                <Typography fontSize={'13px'} >Reach out to use in case of any issue</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

        </Box>
    )
}

export default HomeSettings