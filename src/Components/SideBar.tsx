import { Box, Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GroupsIcon from '@mui/icons-material/Groups';
import MergeIcon from '@mui/icons-material/Merge';
import SegmentIcon from '@mui/icons-material/Segment';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

import '../Styles/CSS/SidebarStyle.css'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setSideBarPosition } from '../Redux/Reducers/sidebarPosReducer';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import InviteMemberModal from '../Modals/InviteMemberModal';
import SettingsModal from './SettingsModal';
import { userRoleType } from '../Utils/types';
import { colorPalette, settingIds } from '../Utils/Constants';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 13,
    },
}));

const SIDE_BAR_IDS = {
    HOME: 'Home',
    SURVEYS: 'Surveys',
    FLOWS: 'Automation',
    CONTACTS: 'Contacts',
    SEGMENT: 'Segments',
    DASHBOARD: 'Dashboard',
    SETTINGS: 'Settings',
    NOTIFICATION: 'Notifications',
    ACCOUNT: 'Account',
    TASKS: 'Tasks'
}

function SideBar(props: any) {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sideBarPos = useSelector((state: any) => state.sideBarReducer);
    const userRole: userRoleType = useSelector((state: any) => state.userRole);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [openInviteModal, setOpenInviteModal] = useState(false);

    const handlePositionChange = (sideBarId: string) => {
        dispatch(setSideBarPosition(sideBarId));
        switch (sideBarId) {
            case SIDE_BAR_IDS.HOME:
                navigate('/home')
                break;
            case SIDE_BAR_IDS.SURVEYS:
                navigate('/surveys');
                break;
            case SIDE_BAR_IDS.CONTACTS:
                // navigate('/contacts');
                navigate('/companies');
                break;
            case SIDE_BAR_IDS.SEGMENT:
                navigate('/segment');
                break;
            case SIDE_BAR_IDS.DASHBOARD:
                navigate('/dashboard');
                break;
            case SIDE_BAR_IDS.FLOWS:
                navigate('/flows/publish');
                break;
            case SIDE_BAR_IDS.SETTINGS:
                navigate('/settings/home');
                break;
            case SIDE_BAR_IDS.TASKS:
                navigate('/tasks');
                break;
            case SIDE_BAR_IDS.NOTIFICATION:
                navigate('/notifications');
                break;
            default:
                navigate('/');
                break;
        }
    }

    const handleProfileClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    }

    useEffect(() => {
        const path = window.location.pathname;
        if(path === '/home'){
            dispatch(setSideBarPosition(SIDE_BAR_IDS.HOME));
        }else if(path === '/surveys'){
            dispatch(setSideBarPosition(SIDE_BAR_IDS.SURVEYS));
        }else if(path === '/companies' || path.includes('companies') || path.includes('people')){
            dispatch(setSideBarPosition(SIDE_BAR_IDS.CONTACTS));
        }else if(path === '/segment'){
            dispatch(setSideBarPosition(SIDE_BAR_IDS.SEGMENT));
        }else if(path === '/dashboard'){
            dispatch(setSideBarPosition(SIDE_BAR_IDS.DASHBOARD));
        }else if(path.includes('/flows')){
            dispatch(setSideBarPosition(SIDE_BAR_IDS.FLOWS));
        }else if(path.includes('/settings')){
            dispatch(setSideBarPosition(SIDE_BAR_IDS.SETTINGS));
        }else if(path === '/tasks'){
            dispatch(setSideBarPosition(SIDE_BAR_IDS.TASKS));
        }else if(path === '/notifications'){
            dispatch(setSideBarPosition(SIDE_BAR_IDS.NOTIFICATION));
        }
    },[window.location.pathname])

    return (
        <Box className='sidebar-main-container' >
            <Box>
                <Box className='sidebar-icon-container' >
                    <Box sx={{backgroundColor : colorPalette.darkBackground,borderRadius : '5px',height : '40px'}} >
                        <img 
                            style={{marginTop : '7px'}}
                            className='sidebar-icons logo' 
                            src='/logo-churn-original.png' 
                            alt='Logo' 
                        />
                    </Box>
                </Box>
                <Box className={sideBarPos === SIDE_BAR_IDS.HOME ? 'selected-side-bar-icon' : 'sidebar-icon-container'} >
                    <LightTooltip title={SIDE_BAR_IDS.HOME} placement="right-start" arrow>
                        <HomeIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.HOME)} className='sidebar-icons' />
                    </LightTooltip>
                </Box>
                <Box className={sideBarPos === SIDE_BAR_IDS.DASHBOARD ? 'selected-side-bar-icon' : 'sidebar-icon-container'} >
                    <LightTooltip title={SIDE_BAR_IDS.DASHBOARD} placement="right-start" arrow>
                        <DashboardIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.DASHBOARD)} className='sidebar-icons' />
                    </LightTooltip>
                </Box>
                <Box className={sideBarPos === SIDE_BAR_IDS.CONTACTS ? 'selected-side-bar-icon' : 'sidebar-icon-container'} >
                    <LightTooltip title={SIDE_BAR_IDS.CONTACTS} placement="right-start" arrow>
                        <GroupsIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.CONTACTS)} className='sidebar-icons' />
                    </LightTooltip>
                </Box>
                {/* <Box className={sideBarPos === SIDE_BAR_IDS.SEGMENT ? 'selected-side-bar-icon' : 'sidebar-icon-container'} >
                    <LightTooltip title={SIDE_BAR_IDS.SEGMENT} placement="right-start" arrow>
                        <SegmentIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.SEGMENT)} className='sidebar-icons' />
                    </LightTooltip>
                </Box> */}
                <Box className={sideBarPos === SIDE_BAR_IDS.TASKS ? 'selected-side-bar-icon' : 'sidebar-icon-container'} >
                    <LightTooltip title={SIDE_BAR_IDS.TASKS} placement="right-start" arrow>
                        <FormatListBulletedIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.TASKS)} className='sidebar-icons' />
                    </LightTooltip>
                </Box>
                {
                    userRole === 'OWNER' &&
                    <Box className={sideBarPos === SIDE_BAR_IDS.FLOWS ? 'selected-side-bar-icon' : 'sidebar-icon-container'} >
                        <LightTooltip title={SIDE_BAR_IDS.FLOWS} placement="right-start" arrow>
                            <AutoFixHighIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.FLOWS)} className='sidebar-icons' />
                        </LightTooltip>
                    </Box>
                }
                {
                    userRole === 'OWNER' &&
                    <Box className={sideBarPos === SIDE_BAR_IDS.SURVEYS ? 'selected-side-bar-icon' : 'sidebar-icon-container'} >
                        <LightTooltip title={SIDE_BAR_IDS.SURVEYS} placement="right-start" arrow>
                            <SentimentVerySatisfiedIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.SURVEYS)} className='sidebar-icons' />
                        </LightTooltip>
                    </Box>
                }
            </Box>
            <Box>
                {/* <Box className={sideBarPos === SIDE_BAR_IDS.NOTIFICATION ? 'selected-side-bar-icon' : 'sidebar-icon-container'} >
                    <LightTooltip title={SIDE_BAR_IDS.NOTIFICATION} placement="right-start" arrow>
                        <NotificationsIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.NOTIFICATION)} className='sidebar-icons' />
                    </LightTooltip>
                </Box>                 */}
                <Box className={sideBarPos === SIDE_BAR_IDS.SETTINGS ? 'selected-side-bar-icon' : 'sidebar-icon-container'} >
                    <LightTooltip title={SIDE_BAR_IDS.SETTINGS} placement="right-start" arrow>
                        <SettingsIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.SETTINGS)} className='sidebar-icons' />
                    </LightTooltip>
                </Box>
                <Box className={sideBarPos === SIDE_BAR_IDS.ACCOUNT ? 'selected-side-bar-icon' : 'sidebar-icon-container'} >
                    <LightTooltip title={SIDE_BAR_IDS.ACCOUNT} placement="right-start" arrow>
                        <AccountCircleIcon onClick={handleProfileClick} className='sidebar-icons' />
                    </LightTooltip>
                </Box>
            </Box>
            <SettingsModal
                close={() => setAnchorEl(null)}
                anchor={anchorEl}
                open={open}
            />
            <InviteMemberModal open={openInviteModal} close={() => setOpenInviteModal(false)} />
        </Box>
    )
}

export default SideBar