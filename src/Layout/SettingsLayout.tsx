import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { colorPalette, settingIds } from '../Utils/Constants'
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import GroupsIcon from '@mui/icons-material/Groups';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import DataObjectIcon from '@mui/icons-material/DataObject';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

import '../Styles/CSS/SettingsSideBar.css';
import { useNavigate } from 'react-router';
import OrgGeneralSettings from '../Components/OrgGeneralSettings';
import OrgTeamMatesSettings from '../Components/OrgTeamMatesSettings';
import SubscriptionSettings from '../Components/SubscriptionSettings';
import SurveyGeneralSettings from '../Components/SurveyGeneralSettings';
import Support from './Support';
import CustomerHubSettingsLayout from './CustomerHubSettingsLayout';
import AnalyticsSettingsLayout from './AnalyticsSettingsLayout';
import DataModelerLayout from './DataModelerLayout';
import HealthDesignerLayout from './HealthDesignerLayout';
import HomeSettings from '../Components/HomeSettings';

const sideBarStyle = {
    background: colorPalette.secondary,
    height: 'calc(100vh - 40px)',
    width: '220px',
    padding: '20px',
    overflowY : 'scroll'
}

const sidebarTabStye = {
    container: { textAlign: 'start', marginTop: '40px' },
    headingP: { color: '#454545', fontSize: '13px', fontWeight: 500 },
}

function SettingsLayout() {

    const navigate = useNavigate();
    const [selectedPos , setSelectedPos] = useState(settingIds.HOME);

    //TODO create settings layout URL based navigation instead of JS based
    useEffect(() => {
        handleTabHighlight(selectedPos);
    },[])

    function handleSettingsClickFromChild(id :string){
        handleSettingsClick({
            target : {
                id : id
            }
        });
    }
    
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
                    <p style={sidebarTabStye.headingP} >General</p>
                    <Box className='tabs' id={settingIds.HOME} onClick={handleSettingsClick} >
                        <CorporateFareIcon id={settingIds.HOME} />
                        <p id={settingIds.HOME} >Home</p>
                    </Box>
                </Box>

                {/* branding tab */}
                <Box sx={sidebarTabStye.container} >
                    <p style={sidebarTabStye.headingP} >Customer Engagement</p>
                    <Box className='tabs' id={settingIds.LOGO} onClick={handleSettingsClick} >
                        <BrandingWatermarkIcon id={settingIds.LOGO} />
                        <p id={settingIds.LOGO}  >Custom Logo</p>
                    </Box>
                    <Box className='tabs' id={settingIds.CUSTOMER_HUB} onClick={handleSettingsClick} >
                        <DeviceHubIcon id={settingIds.CUSTOMER_HUB} />
                        <p id={settingIds.CUSTOMER_HUB}  >Customer Hub</p>
                    </Box>
                    {/* <Box className='tabs' id={settingIds.ANALYTICS} onClick={handleSettingsClick} >
                        <AutoGraphIcon id={settingIds.ANALYTICS} />
                        <p id={settingIds.ANALYTICS}  >Analytics</p>
                    </Box> */}
                </Box>

                {/* Data Management tab */}
                <Box sx={sidebarTabStye.container} >
                    <p style={sidebarTabStye.headingP} >Data Management</p>
                    <Box className='tabs' id={settingIds.DATA_MODELER} onClick={handleSettingsClick} >
                        <DataObjectIcon id={settingIds.DATA_MODELER} />
                        <p id={settingIds.DATA_MODELER}  >Data Modeler</p>
                    </Box>
                    <Box className='tabs' id={settingIds.HEALTH_DESIGNER} onClick={handleSettingsClick} >
                        <MonitorHeartIcon id={settingIds.HEALTH_DESIGNER} />
                        <p id={settingIds.HEALTH_DESIGNER}  >Health Designer</p>
                    </Box>
                </Box>

                {/* user tab */}
                <Box sx={sidebarTabStye.container} >
                    <p style={sidebarTabStye.headingP} >User Management</p>
                    <Box className='tabs' id={settingIds.TEAM} onClick={handleSettingsClick} >
                        <GroupsIcon id={settingIds.TEAM} />
                        <p id={settingIds.TEAM}  >Users</p>
                    </Box>
                    <Box className='tabs' id={settingIds.BILL} onClick={handleSettingsClick} >
                        <CreditCardIcon id={settingIds.BILL} />
                        <p id={settingIds.BILL}  >Billing</p>
                    </Box>
                    <Box className='tabs' id={settingIds.ACCOUNT} onClick={handleSettingsClick} >
                        <AccountCircleIcon id={settingIds.ACCOUNT} />
                        <p id={settingIds.ACCOUNT}  >My Account</p>
                    </Box>
                    {/* <Box className='tabs' id={settingIds.NOTIFICATIONS} onClick={handleSettingsClick} >
                        <NotificationsNoneIcon id={settingIds.NOTIFICATIONS} />
                        <p id={settingIds.NOTIFICATIONS}  >Notifications</p>
                    </Box> */}
                    <Box className='tabs' id={settingIds.TICKET} onClick={handleSettingsClick} >
                        <FactCheckIcon id={settingIds.TICKET} />
                        <p id={settingIds.TICKET}  >Create Ticket</p>
                    </Box>
                </Box>
            </Box>

            <Box width={'90%'} sx={{backgroundColor : colorPalette.textSecondary}} padding={'20px'}>
                {selectedPos === settingIds.HOME && <HomeSettings click={handleSettingsClickFromChild} />}
                {selectedPos === settingIds.ACCOUNT && <OrgGeneralSettings/>}
                {selectedPos === settingIds.TEAM && <OrgTeamMatesSettings/>}
                {selectedPos === settingIds.BILL && <SubscriptionSettings/>}
                {selectedPos === settingIds.LOGO && <SurveyGeneralSettings/>}
                {selectedPos === settingIds.CUSTOMER_HUB && <CustomerHubSettingsLayout/>}
                {selectedPos === settingIds.ANALYTICS && <AnalyticsSettingsLayout/>}
                {selectedPos === settingIds.TICKET && <Support />}
                {selectedPos === settingIds.DATA_MODELER && <DataModelerLayout />}
                {selectedPos === settingIds.HEALTH_DESIGNER && <HealthDesignerLayout />}
            </Box>
        </Box>
    )
}

export default SettingsLayout