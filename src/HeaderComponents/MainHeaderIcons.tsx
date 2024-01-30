import React, { useEffect, useState } from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SettingsModal from '../Components/SettingsModal';
import { useNavigate } from 'react-router';
import { Avatar, Box, Button } from '@mui/material';
import { colorPalette, joyrideConstants } from '../Utils/Constants';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { outlinedButtonNoBorder, transparentButton } from '../Styles/ButtonStyle';
import ReactJoyride, { CallBackProps, STATUS } from 'react-joyride';
import { joyrideState } from '../Utils/types';

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
    cursor: 'pointer',
    marginTop: '8px'
}

function MainHeaderIcons(props: { backToHome: boolean, joyRideOver : any }) {

    const navigate = useNavigate();

    const [showNotificationModal, setShowNotificationModal] = React.useState<Boolean>();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const [{ run, steps, stepIndex }, setState] = useState<joyrideState>({
        run: false,
        stepIndex: 0,
        steps: [
            {
                content: <h2>
                    You can get in touch with us directly from here.
                </h2>,
                target: '.get-in-touch',
                disableBeacon: true,
                disableOverlayClose: true,
                placement: 'bottom',
                styles: {
                    options: {
                        zIndex: 10000,
                    },
                },
            },
            {
                content: <h2>
                    Keep an eye on notifications for all latest updates, news, and messages from your team
                </h2>,
                target: '.notification',
                disableBeacon: true,
                disableOverlayClose: true,
                placement: 'bottom',
                styles: {
                    options: {
                        zIndex: 10000,
                    },
                },
            },
            {
                content: <h2>
                    Make changes to your profile or your organization's workspace from the settings section in your profile tab
                </h2>,
                target: '.settings-icon',
                disableBeacon: true,
                disableOverlayClose: true,
                placement: 'bottom',
                styles: {
                    options: {
                        zIndex: 10000,
                    },
                },
            },
        ],
    });

    useEffect(() => {
        handleJoyrideVisibility();
    }, [props.backToHome]);

    useEffect(() => {
        handleJoyrideVisibility();
    }, []);

    const handleJoyrideVisibility = () => {
        const hasSeenPrevJoyride = localStorage.getItem(joyrideConstants.JOYRIDE_4);
        if (!hasSeenPrevJoyride) {
            setState({
                run: false,
                steps: steps,
                stepIndex: 0,
            });
            return;
        }

        const hasSeenJoyride = localStorage.getItem(joyrideConstants.JOYRIDE_5);
        if (!hasSeenJoyride) {
            setState({
                run: true,
                steps: steps,
                stepIndex: 0,
            });
            setTimeout(() => {
                localStorage.setItem(joyrideConstants.JOYRIDE_5, 'true');
            },1000);
        }
        //TODO JOYRIDE remove this
        // localStorage.removeItem('header-joyride');
    }

    const handleSettingsClose = (event: any) => {
        setAnchorEl(null);
    }

    const handleNotificationBellClick = () => {
        closeAllModals();
        setShowNotificationModal(!showNotificationModal);
    }

    const handleSettingsBellClick = (event: any) => {
        // closeAllModals();
        setAnchorEl(event.currentTarget);
    }

    const closeAllModals = () => {
        setShowNotificationModal(false);
    }

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, type, index, action } = data;
        // const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setState({ run: false, steps: steps, stepIndex: 0, });
            props.joyRideOver();
        }
    };

    return (
        <>
            <ReactJoyride
                callback={handleJoyrideCallback}
                continuous
                hideCloseButton
                run={run}
                scrollToFirstStep
                showProgress
                showSkipButton
                steps={steps}
                styles={{
                    options: {
                        zIndex: 10000,
                    },
                    buttonNext: {
                        backgroundColor: colorPalette.primary
                    },
                    buttonBack: {
                        color: colorPalette.primary
                    }
                }}
            />
            <Box sx={{ display: 'flex' }} >
                <Button
                    className='get-in-touch'
                    startIcon={<CalendarMonthIcon />}
                    sx={{ ...transparentButton, marginTop: '5px', marginRight: '10px' }}
                    onClick={() => window.open('https://calendly.com/feedbacksense/demo', '__blank')}
                >
                    Get in touch
                </Button>

                <NotificationsNoneOutlinedIcon
                    className='notification'
                    onClick={handleNotificationBellClick}
                    style={iconStyle}
                />
                <Box>
                    <Avatar
                        className='settings-icon'
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
        </>
    )
}

export default MainHeaderIcons