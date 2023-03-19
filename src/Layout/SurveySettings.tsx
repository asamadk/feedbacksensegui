import { Box, Typography } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router';
import CustomTabSet from '../Components/CustomTabSet';
import SurveyGeneralSettings from '../Components/SurveyGeneralSettings';
import SurveySettingsWeb from '../Components/SurveySettingsWeb';
import * as LayoutStyles from '../Styles/LayoutStyles'

const tabsetList = [
    { id : 1,name : 'GENERAL' },
    { id : 2,name : 'WEB SURVEYS' }
]


function SurveySettings(props: any) {

    let navigation = useNavigate();
    const [tabset, setTabset] = React.useState(parseInt(props.tabset))

    const changetabset = (value: number) => {
        setTabset(value);
        if (value === 0) {
            navigation('/survey/global/settings/general')
        } else if (value === 1) {
            navigation('/survey/global/settings/web');
        }
    }

    return (
        <Box sx={LayoutStyles.settingLayoutStyle} >
            
            <Box sx={{ textAlign: 'start' }} >
                <Typography variant='h4' sx={LayoutStyles.settingsHeaderTextStyle} >Survey Settings</Typography>
            </Box>

            <Box sx={{ marginTop: '20px' }} >
                <CustomTabSet tabsetList={tabsetList}  change={(value: number) => changetabset(value)} index={props.tabset} />
            </Box>

            {tabset === 0 && <Box><SurveyGeneralSettings/></Box>}

            {tabset === 1 && <Box><SurveySettingsWeb/></Box>}


        </Box>
    )
}

export default SurveySettings