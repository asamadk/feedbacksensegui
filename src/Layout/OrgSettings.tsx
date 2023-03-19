import { Box, Typography } from '@mui/material'
import React from 'react'
import { useNavigate, useParams } from 'react-router'
import * as Types from '../Utils/types'
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

    let navigation = useNavigate();
    const [tabset, setTabset] = React.useState(parseInt(props.tabset))

    const changetabset = (value: number) => {
        setTabset(value);
        if(value === 0){
            navigation('/org/general')
        }else if(value === 1){
            navigation('/org/teammates');
        }else{
            navigation('/org/subscription');
        }
    }

    return (
        <Box sx={LayoutStyles.settingLayoutStyle} >
            
            <Box sx={{ textAlign: 'start' }} >
                <Typography variant='h4' sx={LayoutStyles.settingsHeaderTextStyle} >Organizational Settings</Typography>
            </Box>

            <Box sx={{ marginTop: '20px' }} >
                <CustomTabSet tabsetList={tabsetList} change={(value: number) => changetabset(value)} index={props.tabset} />
            </Box>

            {tabset === 0 && <Box><OrgGeneralSettings/></Box>}

            {tabset === 1 && <Box><OrgTeamMatesSettings/></Box>}

            {tabset === 2 && <Box><SubscriptionSettings/></Box>}
        
        </Box>
    )
}

export default OrgSettings