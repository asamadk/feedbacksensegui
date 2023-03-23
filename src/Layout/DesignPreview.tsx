import { Box, Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React from 'react'
import * as ButtonStyles from '../Styles/ButtonStyle'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LaptopIcon from '@mui/icons-material/Laptop';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import * as LayoutStyles from '../Styles/LayoutStyles'
import CustomTabSet from '../Components/CustomTabSet';
import { useNavigate } from 'react-router';
import SurveyThemeSelector from '../Components/SurveyThemeSelector';
import EmailSurveyTemplate from '../Components/EmailSurveyTemplate';

const tabsetList = [
    { id: 1, name: 'THEMES' },
    { id: 2, name: 'EMAIL TEMPLATES' }
]

const localNavbar = {
    borderBottom: '1px #454545 solid',
    paddingBottom: '10px',
    textAlign: 'end',
    paddingRight: '10px', display: 'flex', justifyContent: 'space-between'
}

function DesignPreview() {

    const [tabset, setTabset] = React.useState(0);
    const [devices, setDevices] = React.useState('phone');

    const handleDevices = (
        event: React.MouseEvent<HTMLElement>,
        newDevices: string,
    ) => {
        if (newDevices != null) {
            setDevices(newDevices);
        }
    };

    const changetabset = (value: number) => {
        setTabset(value);
    }


    return (
        <Box sx={{ backgroundColor: '#1E1E1E', height: 'calc(100vh - 69px)',overflowY : 'hidden' }} >
            <Box sx={localNavbar} >
                <Box sx={{ position: 'relative', right: '-20px' }}>
                    <CustomTabSet tabsetList={tabsetList} change={(value: number) => changetabset(value)} index={tabset} />
                </Box>
                <Box>
                    <ToggleButtonGroup
                        value={devices}
                        onChange={handleDevices}
                        exclusive
                        aria-label="device"
                        sx={{ marginTop: '5px' }}
                    >
                        <ToggleButton color='warning' value="laptop" aria-label="laptop">
                            <LaptopIcon sx={{ color: '#f1f1f1' }} />
                        </ToggleButton>
                        <ToggleButton color='warning' value="phone" aria-label="phone">
                            <PhoneAndroidIcon sx={{ color: '#f1f1f1' }} />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>
            <Box sx={{display : 'flex',justifyContent : 'center'}} >
                <Box width={'35%'} >
                    {tabset === 0 &&  <SurveyThemeSelector/>}
                    {tabset === 1 &&  <EmailSurveyTemplate/>}
                </Box>
                <Box width={'65%'} height={'calc(100vh - 134px)'} sx={{backgroundColor : '#F1F1F1'}} >
                    <HelpCenterIcon sx={{color : '#FFA500',marginTop : '30%'}} />
                    <Typography fontSize={28} >Nothing to see here yet. Add your first question first!</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default DesignPreview;