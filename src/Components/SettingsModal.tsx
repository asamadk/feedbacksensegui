import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { useNavigate } from "react-router";
import { handleLogout } from "../Utils/FeedbackUtils";
import { useSelector } from "react-redux";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import { colorPalette } from "../Utils/Constants";

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
          <Box sx={{borderBottom : `1px ${colorPalette.fsGray} solid`,padding : '10px'}} >
            <Typography><b>{currentUserState?.name}</b></Typography>
            <Typography color={colorPalette.textPrimary}>{currentUserState?.email}</Typography>
          </Box>
        <MenuItem onClick={() => handleSettingsRouting('/org/general')} >
          Settings
        </MenuItem >
        <MenuItem  onClick={() => handleSettingsRouting('/survey/global/settings/general')} >
          Branding
        </MenuItem>
        <MenuItem onClick={() => handleSettingsRouting('/org/teammates')} >
          Teammates
        </MenuItem>
        <MenuItem  onClick={() => handleSettingsRouting('/org/subscription')} >
          Billing
        </MenuItem>
        <MenuItem onClick={() => handleSettingsRouting('/support')} >
          Support
        </MenuItem>
        <MenuItem onClick={handleLogout} >
          Logout
        </MenuItem>
      </Menu>
    </>
    // <List
    //   sx={settingsMainStyle(defaultColor?.primaryColor)}
    //   subheader={
    //     <ListSubheader
    //       style={{
    //         backgroundColor: defaultColor?.primaryColor,
    //         color: "#808080",
    //         textAlign: "start",
    //       }}
    //     >
    //       Settings
    //     </ListSubheader>
    //   }
    // >
    //   <ListItem>
    //     <ListItemText
    //       onClick={() => handleSettingsRouting('/org/general')}
    //       onMouseOver={changeBackground}
    //       onMouseLeave={revertBackground}
    //       style={singleElementStyle}
    //       id="Organization-Settings"
    //       primary="Organization Settings"
    //     />
    //   </ListItem>
    //   <ListItem>
    //     <ListItemText
    //       onClick={() => handleSettingsRouting('/survey/global/settings/general')}
    //       onMouseOver={changeBackground}
    //       onMouseLeave={revertBackground}
    //       style={singleElementStyle}
    //       id="Survey-Settings"
    //       primary="Branding"
    //     />
    //   </ListItem>
  
    // </List>
  );
}
