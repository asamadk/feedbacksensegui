import React from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SettingsModal from '../Components/SettingsModal';
import { useNavigate } from 'react-router';
import { Avatar, Box, Button } from '@mui/material';
import { colorPalette } from '../Utils/Constants';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { outlinedButtonNoBorder, transparentButton } from '../Styles/ButtonStyle';

const iconStyle: {} = {
    color: colorPalette.primary,
    fontSize: 30,
    cursor: 'pointer',
    paddingRight: '10px',
    paddingTop: '8px'
}

const avatarStyle = { 
    bgcolor: colorPalette.primary, 
    width: 30, 
    height: 30, 
    fontSize: 20, 
    color: colorPalette.textSecondary, 
    cursor: 'pointer' ,
    marginTop : '8px'
}

function MainHeaderIcons() {

    const navigate = useNavigate();

    const [showNotificationModal, setShowNotificationModal] = React.useState<Boolean>();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleSettingsClose = (event: any) => {
        setAnchorEl(null);
    }

    const handleNotificationBellClick = () => {
        closeAllModals();
        setShowNotificationModal(!showNotificationModal);
    }

    const handleSettingsBellClick = (event : any) => {
        // closeAllModals();
        setAnchorEl(event.currentTarget);
    }

    const closeAllModals = () => {
        setShowNotificationModal(false);
    }

    return (
        <Box sx={{ display: 'flex' }} >
            <Button
                startIcon={<CalendarMonthIcon />}
                sx={{ ...transparentButton, marginTop: '5px', marginRight: '10px' }}
                onClick={() => window.open('https://calendly.com/feedbacksense/demo', '__blank')}
            >
                Get in touch
            </Button>

            <NotificationsNoneOutlinedIcon
                onClick={handleNotificationBellClick}
                style={iconStyle}
            />
            <Box>
                <Avatar
                    onClick={handleSettingsBellClick}
                    sx={avatarStyle}
                    alt={'S'}
                    src='/'
                />
                <SettingsModal
                    close={handleSettingsClose}
                    anchor={anchorEl}
                    open={open}
                />
            </Box>
        </Box>
    )
}

export default MainHeaderIcons