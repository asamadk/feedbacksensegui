import { useNavigate } from "react-router";
import { handleLogout } from "../Utils/FeedbackUtils";
import { useSelector } from "react-redux";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import { colorPalette } from "../Utils/Constants";

import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import Person2Icon from '@mui/icons-material/Person2';
import SupportIcon from '@mui/icons-material/Support';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import CallIcon from '@mui/icons-material/Call';

export default function SettingsModal(props: any) {

  const navigation = useNavigate();
  const currentUserState = useSelector((state: any) => state.currentUser);

  const handleSettingsRouting = (path: string) => {
    props.close();
    navigation(path);
  }

  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={props.anchor}
        open={props.open}
        onClose={props.close}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Box sx={{ borderBottom: `1px ${colorPalette.fsGray} solid`, padding: '10px' }} >
          <Typography><b>{currentUserState?.name}</b></Typography>
          <Typography color={colorPalette.textPrimary}>{currentUserState?.email}</Typography>
        </Box>
        <MenuItem onClick={() => window.open('https://help.retainsense.com/')} >
          <HelpCenterIcon sx={{color : colorPalette.primary,marginRight : '10px'}} />Help Center
        </MenuItem>
        <MenuItem onClick={() => window.open('https://calendly.com/retainsense/30min')} >
          <CallIcon sx={{color : colorPalette.primary,marginRight : '10px'}} />Get in touch
        </MenuItem>
        <MenuItem onClick={handleLogout} >
          <LogoutIcon sx={{color : colorPalette.primary,marginRight : '10px'}} />Logout
        </MenuItem>
      </Menu>
    </>
  );
}
