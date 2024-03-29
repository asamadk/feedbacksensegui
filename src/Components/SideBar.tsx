import { Avatar, Box, Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import GridViewIcon from '@mui/icons-material/GridView';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArchitectureIcon from '@mui/icons-material/Architecture';

import '../Styles/CSS/SidebarStyle.css'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setSideBarPosition } from '../Redux/Reducers/sidebarPosReducer';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import InviteMemberModal from '../Modals/InviteMemberModal';
import SettingsModal from './SettingsModal';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import { componentName } from '../Utils/Constants';
import { userRoleType } from '../Utils/types';

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
    WORKFLOW: 'Workflows',
    CONTACTS: 'Contacts',
    TEMPLATES: 'Templates',
    DASHBOARD: 'Dashboard',
    INVITE_TEAMMATES: 'Invite Teammates',
    INTEGRATIONS: 'Integrations',
    SETTINGS: 'Settings',
    NOTIFICATION : 'Notifications',
    ACCOUNT : 'Account'
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
        switch(sideBarId){
            case SIDE_BAR_IDS.HOME:
                navigate('/');
                break;
            case SIDE_BAR_IDS.TEMPLATES:
                navigate('/template');
                break;
            case SIDE_BAR_IDS.DASHBOARD:
                navigate('/dashboard');
                break;
            case SIDE_BAR_IDS.INTEGRATIONS:
                navigate('/integration');
                break;
            case SIDE_BAR_IDS.SETTINGS:
                navigate('/settings');
                break;
            case SIDE_BAR_IDS.INVITE_TEAMMATES:
                setOpenInviteModal(true);
                break;
            default:
                navigate('/');
                break;
        }
    }

    const handleProfileClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    }

    return (
        <Box className='sidebar-main-container' >
            <Box>
                <Box className='sidebar-icon-container' >
                    <LightTooltip title={SIDE_BAR_IDS.HOME} placement="right-start" arrow>
                        <HomeIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.HOME)} className='sidebar-icons' />
                    </LightTooltip>
                </Box>
                {/* <Box className='sidebar-icon-container' >
                    <LightTooltip title={SIDE_BAR_IDS.WORKFLOW} placement="right-start" arrow>
                        <AutoModeIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.WORKFLOW)} className='sidebar-icons' />
                    </LightTooltip>
                </Box> */}
                {/* <Box className='sidebar-icon-container' >
                    <LightTooltip title={SIDE_BAR_IDS.CONTACTS} placement="right-start" arrow>
                        <PersonIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.CONTACTS)} className='sidebar-icons' />
                    </LightTooltip>
                </Box> */}
                <Box className='sidebar-icon-container' >
                    <LightTooltip title={SIDE_BAR_IDS.TEMPLATES} placement="right-start" arrow>
                        <ArchitectureIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.TEMPLATES)} className='sidebar-icons' />
                    </LightTooltip>
                </Box>
                <Box className='sidebar-icon-container' >
                    <LightTooltip title={SIDE_BAR_IDS.DASHBOARD} placement="right-start" arrow>
                        <DashboardIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.DASHBOARD)} className='sidebar-icons' />
                    </LightTooltip>
                </Box>
            </Box>
            <Box>
                <Box className='sidebar-icon-container' >
                    <LightTooltip title={SIDE_BAR_IDS.INVITE_TEAMMATES} placement="right-start" arrow>
                        <PersonAddIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.INVITE_TEAMMATES)} className='sidebar-icons' />
                    </LightTooltip>
                </Box>
                <Box className='sidebar-icon-container' >
                    <LightTooltip title={SIDE_BAR_IDS.INTEGRATIONS} placement="right-start" arrow>
                        <GridViewIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.INTEGRATIONS)} className='sidebar-icons' />
                    </LightTooltip>
                </Box>
                {/* <Box className='sidebar-icon-container' >
                    <LightTooltip title={SIDE_BAR_IDS.NOTIFICATION} placement="right-start" arrow>
                        <NotificationsNoneIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.NOTIFICATION)} className='sidebar-icons' />
                    </LightTooltip>
                </Box> */}
                {
                    CoreUtils.isComponentVisible(userRole, componentName.BILLING_INFO_HOME) &&
                    <Box className='sidebar-icon-container' >
                        <LightTooltip title={SIDE_BAR_IDS.SETTINGS} placement="right-start" arrow>
                            <SettingsIcon onClick={() => handlePositionChange(SIDE_BAR_IDS.SETTINGS)} className='sidebar-icons' />
                        </LightTooltip>
                    </Box>
                }
                <Box className='sidebar-icon-container' >
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