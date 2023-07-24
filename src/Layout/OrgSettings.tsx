import { Box, IconButton, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import * as Types from '../Utils/types'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as LayoutStyles from '../Styles/LayoutStyles'
import CustomTabSet from '../Components/CustomTabSet'
import OrgGeneralSettings from '../Components/OrgGeneralSettings'
import OrgTeamMatesSettings from '../Components/OrgTeamMatesSettings'
import SubscriptionSettings from '../Components/SubscriptionSettings'

const tabsetList = [
    { id : 1,name : 'GENERAL' },
    { id : 2,name : 'TEAMMATES' },
    { id : 3,name : 'SUBSCRIPTION' }
]

function OrgSettings(props : any) {

    const [tabset, setTabset] = React.useState(parseInt(props.tabset))

    useEffect(() => {
        changeTabSet(props.tabset);
    },[props.tabset]);

    let navigation = useNavigate();

    const changeTabSet = (value: number) => {
        setTabset(value);
        if(value === 0){
            navigation('/org/general')
        }else if(value === 1){
            navigation('/org/teammates');
        }else{
            navigation('/org/subscription');
        }
    }

    const handleBackButtonClick = () => {
        navigation('/');
    }

    return (
        <Box sx={LayoutStyles.settingLayoutStyle} >
            <Box display={'flex'} sx={{ textAlign: 'start' }} >
                <IconButton color='info' onClick={handleBackButtonClick} >
                    <ArrowBackIcon sx={{ color: '#f1f1f1' }} />
                </IconButton>
                <Typography 
                    variant='h4' 
                    style={{paddingTop : '5px'}} 
                    sx={LayoutStyles.settingsHeaderTextStyle} 
                >
                    Organizational Settings
                </Typography>
            </Box>

            <Box sx={{ marginTop: '20px' }} >
                <CustomTabSet tabsetList={tabsetList} change={(value: number) => changeTabSet(value)} index={tabset} />
            </Box>

            {tabset === 0 && <Box><OrgGeneralSettings/></Box>}

            {tabset === 1 && <Box><OrgTeamMatesSettings/></Box>}

            {tabset === 2 && <Box><SubscriptionSettings/></Box>}
        
        </Box>
    )
}

export default OrgSettings