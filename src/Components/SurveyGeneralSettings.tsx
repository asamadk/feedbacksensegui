import { Box, FormControlLabel, Switch, Typography } from '@mui/material'
import React from 'react'
import * as LayoutStyles from '../Styles/LayoutStyles'


function SurveyGeneralSettings() {
    return (
        <Box  style={{display : 'flex'}} sx={LayoutStyles.globalSettingSubContainers} >
            <Box textAlign={'start'} marginRight={20} >
                <Typography color={'#f1f1f1'} sx={{ marginBottom: '10px' }} >Company Logo (Comming soon)</Typography>
                <Typography color={'#454545'} sx={{ textDecoration: 'underline', cursor: 'pointer' }} >Upload Logo</Typography>
            </Box>
        </Box>
    )
}

export default SurveyGeneralSettings