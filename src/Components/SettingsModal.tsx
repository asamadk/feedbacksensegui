import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { useNavigate } from "react-router";
import * as Endpoint from '../Utils/Endpoints'


const settingsMainStyle = {
  width: "100%",
  maxWidth: 234,
  backgroundColor: "#121212",
  color: "#f1f1f1",
  position: "absolute",
  border: "1px #454545 solid",
  right: "10px",
  borderRadius: "5px",
  zIndex : 10
};

const singleElementStyle = {
  cursor: "pointer",
};

export default function SettingsModal(props : any) {

  const navigation = useNavigate();

  const changeBackground = (e: any) => {
    e.target.style.color = '#FFA500';
    e.target.style.borderRadius = '5px'
  };

  const revertBackground = (e: any) => {
    e.target.style.color = '#f1f1f1';
  };

  const handleSettingsRouting = (path : string) => {
    props.close();
    navigation(path);
  }

  const handleLogout = async () => {
    window.open(
      Endpoint.logout(),
      "_self"
  );
  }

  return (
    <List
      sx={settingsMainStyle}
      subheader={
        <ListSubheader
          style={{
            backgroundColor: "#121212",
            color: "#323533",
            textAlign: "start",
          }}
        >
          Settings
        </ListSubheader>
      }
    >
      <ListItem>
        <ListItemText
          onClick={() => handleSettingsRouting('/org/general')}
          onMouseOver={changeBackground}
          onMouseLeave={revertBackground}
          style={singleElementStyle}
          id="Organization-Settings"
          primary="Organization Settings"
        />
      </ListItem>
      <ListItem>
        <ListItemText
          onClick={() => handleSettingsRouting('/survey/global/settings/general')}
          onMouseOver={changeBackground}
          onMouseLeave={revertBackground}
          style={singleElementStyle}
          id="Survey-Settings"
          primary="Survey Settings"
        />
      </ListItem>
      <ListItem>
        <ListItemText
          onMouseOver={changeBackground}
          onMouseLeave={revertBackground}
          style={singleElementStyle}
          id="Subscription"
          primary="Subscription"
          onClick={() => handleSettingsRouting('/org/subscription')}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          onMouseOver={changeBackground}
          onMouseLeave={revertBackground}
          style={singleElementStyle}
          id="Invite-Teammates"
          primary="Invite Teammates"
          onClick={() => handleSettingsRouting('/org/teammates')}
        />
      </ListItem>

      <ListItem>
        <ListItemText
          style={{ color: "#323533", fontSize: "14" }}
          id="profile"
          primary="Profile"
        />
      </ListItem>
      <ListItem>
        <ListItemText
          onMouseOver={changeBackground}
          onMouseLeave={revertBackground}
          style={singleElementStyle}
          id="Profile-&-Password"
          primary="Profile & Password"
          onClick={() => handleSettingsRouting('/org/general')}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          onMouseOver={changeBackground}
          onMouseLeave={revertBackground}
          style={singleElementStyle}
          id="Logout"
          onClick={handleLogout}
          primary="Logout"
        />
      </ListItem>
    </List>
  );
}
