import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { colorPalette } from '../Utils/Constants'
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import GroupsIcon from '@mui/icons-material/Groups';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import FactCheckIcon from '@mui/icons-material/FactCheck';

import '../Styles/CSS/SettingsSideBar.css';
import { useNavigate } from 'react-router';
import OrgGeneralSettings from '../Components/OrgGeneralSettings';
import OrgTeamMatesSettings from '../Components/OrgTeamMatesSettings';
import SubscriptionSettings from '../Components/SubscriptionSettings';
import SurveyGeneralSettings from '../Components/SurveyGeneralSettings';
import Support from './Support';

const sideBarStyle = {
    background: colorPalette.secondary,
    height: 'calc(100vh - 40px)',
    width: '200px',
    padding: '20px'
}

const sidebarTabStye = {
    container: { textAlign: 'start', marginTop: '40px' },
    headingP: { color: '#454545', fontSize: '13px', fontWeight: 500 },
}

const settingIds = {
    GENERAL: 'GENERAL',
    TEAM: 'TEAM',
    BILL: 'BILL',
    LOGO: 'LOGO',
    ACCOUNT: 'ACCOUNT',
    NOTIFICATIONS: 'NOTIFICATIONS',
    TICKET: 'TICKET'
}

function SettingsLayout() {

    const navigate = useNavigate();
    const [selectedPos , setSelectedPos] = useState(settingIds.GENERAL);

    useEffect(() => {
        handleTabHighlight(selectedPos);
    },[])

    const handleSettingsClick = (event: any) => {
        const id: string = event.target.id;
        handleTabNavigate(id);
        handleTabHighlight(id);
    }

    const handleTabHighlight = (id: string) => {
        const tabElements = document.getElementsByClassName('tabs');
        for (let i = 0; i < tabElements.length; i++) {
            const item = tabElements.item(i);
            if (item?.id === id) {
                item.classList.add('selected-tab');
            } else {
                item?.classList.remove('selected-tab');
            }
        }
    }

    const handleTabNavigate = (id: string) => {
        setSelectedPos(id);
    }

    return (
        <Box display={'flex'} >
            <Box sx={sideBarStyle} >

                {/* workspace tab */}
                <Box sx={{ ...sidebarTabStye.container, marginTop: '10px' }} >
                    <p style={sidebarTabStye.headingP} >WORKSPACE</p>
                    <Box className='tabs' id={settingIds.GENERAL} onClick={handleSettingsClick} >
                        <CorporateFareIcon id={settingIds.GENERAL} />
                        <p id={settingIds.GENERAL} >General</p>
                    </Box>
                    <Box className='tabs' id={settingIds.TEAM} onClick={handleSettingsClick} >
                        <GroupsIcon id={settingIds.TEAM} />
                        <p id={settingIds.TEAM}  >Team</p>
                    </Box>
                    <Box className='tabs' id={settingIds.BILL} onClick={handleSettingsClick} >
                        <CreditCardIcon id={settingIds.BILL} />
                        <p id={settingIds.BILL}  >Billing</p>
                    </Box>
                </Box>

                {/* branding tab */}
                <Box sx={sidebarTabStye.container} >
                    <p style={sidebarTabStye.headingP} >BRANDING</p>
                    <Box className='tabs' id={settingIds.LOGO} onClick={handleSettingsClick} >
                        <BrandingWatermarkIcon id={settingIds.LOGO} />
                        <p id={settingIds.LOGO}  >Custom Logo</p>
                    </Box>
                </Box>

                {/* user tab */}
                <Box sx={sidebarTabStye.container} >
                    <p style={sidebarTabStye.headingP} >USER</p>
                    <Box className='tabs' id={settingIds.ACCOUNT} onClick={handleSettingsClick} >
                        <AccountCircleIcon id={settingIds.ACCOUNT} />
                        <p id={settingIds.ACCOUNT}  >My Account</p>
                    </Box>
                    <Box className='tabs' id={settingIds.NOTIFICATIONS} onClick={handleSettingsClick} >
                        <NotificationsNoneIcon id={settingIds.NOTIFICATIONS} />
                        <p id={settingIds.NOTIFICATIONS}  >Notifications</p>
                    </Box>
                    <Box className='tabs' id={settingIds.TICKET} onClick={handleSettingsClick} >
                        <FactCheckIcon id={settingIds.TICKET} />
                        <p id={settingIds.TICKET}  >Create Ticket</p>
                    </Box>
                </Box>
            </Box>

            <Box width={'80%'} sx={{backgroundColor : colorPalette.textSecondary}} padding={'20px'}>
                {selectedPos === settingIds.GENERAL && <OrgGeneralSettings/>}
                {selectedPos === settingIds.TEAM && <OrgTeamMatesSettings/>}
                {selectedPos === settingIds.BILL && <SubscriptionSettings/>}
                {selectedPos === settingIds.LOGO && <SurveyGeneralSettings/>}
                {selectedPos === settingIds.TICKET && <Support />}
            </Box>
        </Box>
    )
}

export default SettingsLayout