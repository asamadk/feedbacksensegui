import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import SettingsIcon from '@mui/icons-material/Settings';
import Popover from '../Components/Popover';
import NotificationModal from '../Components/NotificationModal';
import SettingsModal from '../Components/SettingsModal';
import { useNavigate } from 'react-router';
import { Box } from '@mui/material';

const iconStyle: {} = {
    color: '#f1f1f1',
    fontSize: 30,
    cursor: 'pointer',
    paddingLeft: '10px'
}

function MainHeaderIcons() {

    const navigate = useNavigate();

    const [showNotificationModal, setShowNotificationModal] = React.useState<Boolean>();
    const [showSettingsModal, setShowSettingsModal] = React.useState<Boolean>();
    const [showSettingsTitle, setShowSettingsTitle] = React.useState<Boolean>(false);
    const [showNotificationTitle, setShowNotificationTitle] = React.useState<Boolean>(false);
    const [showProfileTitle, setShowProfileTitle] = React.useState<Boolean>(false);

    const handleSettingsClose = () => {
        setShowSettingsModal(false);
    }

    const handleNotificationBellClick = () => {
        closeAllModals();
        setShowNotificationModal(!showNotificationModal);
    }

    const handleUserProfileClick = () => {
        navigate('/org/general');
    }

    const handleSettingsBellClick = () => {
        handleHideSettingsTitle();
        closeAllModals();
        setShowSettingsModal(!showSettingsModal);
    }

    const closeAllModals = () => {
        setShowSettingsModal(false);
        setShowNotificationModal(false);
    }

    const handleShowSettingsTitle = () => setShowSettingsTitle(true);
    const handleHideSettingsTitle = () => setShowSettingsTitle(false);

    const handleShowNotificationTitle = () => setShowNotificationTitle(true);
    const handleHideNotificationTitle = () => setShowNotificationTitle(false);


    const handleShowProfileTitle = () => setShowProfileTitle(true);
    const handleHideProfileTitle = () => setShowProfileTitle(false);
    return (
        <Box>
            <AccountCircleIcon
                onMouseEnter={handleShowProfileTitle}
                onMouseLeave={handleHideProfileTitle}
                style={iconStyle}
                onClick={handleUserProfileClick}
            />
            <Popover open={showProfileTitle} text={'Profile'} />

            <CircleNotificationsIcon
                onMouseEnter={handleShowNotificationTitle}
                onMouseLeave={handleHideNotificationTitle}
                onClick={handleNotificationBellClick}
                style={iconStyle}
            />
            <Popover open={showNotificationTitle} text={'Notifications'} />

            <SettingsIcon
                onMouseEnter={handleShowSettingsTitle}
                onMouseLeave={handleHideSettingsTitle}
                onClick={handleSettingsBellClick}
                style={iconStyle}
            />
            <Popover open={showSettingsTitle} text={'Settings'} />

            {showNotificationModal && <NotificationModal />}
            {showSettingsModal && <SettingsModal close={handleSettingsClose} />}
        </Box>
    )
}

export default MainHeaderIcons