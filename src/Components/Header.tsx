import React from 'react'
import { IconButton, Typography } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationModal from './NotificationModal';
import SettingsModal from './SettingsModal';
import Popover from './Popover';
import { useNavigate } from 'react-router';

const bodyStyle: {} = {
    backgroundColor: '#1E1E1E',
    padding: '20px 20px',
    borderBottom: '1px #454545 solid'
}

const iconStyle: {} = {
    color: '#f1f1f1',
    fontSize: 30,
    cursor: 'pointer',
    paddingLeft: '10px'
}

function Header() {

    let navigate = useNavigate();

    const [showNotificationModal, setShowNotificationModal] = React.useState<Boolean>();
    const [showSettingsModal, setShowSettingsModal] = React.useState<Boolean>();
    const [showSettingsTitle, setShowSettingsTitle] = React.useState<Boolean>(false);
    const [showNotificationTitle, setShowNotificationTitle] = React.useState<Boolean>(false);
    const [showProfileTitle, setShowProfileTitle] = React.useState<Boolean>(false);


    const handleNotificationBellClick = () => {
        closeAllModals();
        setShowNotificationModal(!showNotificationModal);
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

    const handleRouteToHome = () => {
        navigate('/');
    }

    const handleSettingsClose = () => {
        setShowSettingsModal(false);
    }

    return (
        <div style={bodyStyle} >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div onClick={handleRouteToHome} style={{ display: 'flex', cursor: 'pointer' }} >
                    <Typography style={{ color: '#f1f1f1',fontSize : '30px' }} variant='h4'>Feedback</Typography>
                    <Typography style={{ color: '#FFA500',fontSize : '30px' }} variant='h4'>Sense</Typography>
                </div>
                <div>
                    <AccountCircleIcon 
                        onMouseEnter={handleShowProfileTitle} 
                        onMouseLeave={handleHideProfileTitle}
                        style={iconStyle} 
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
                </div>
            </div>

            {showNotificationModal && <NotificationModal />}
            {showSettingsModal && <SettingsModal close={handleSettingsClose} />}
        </div>
    )
}

export default Header