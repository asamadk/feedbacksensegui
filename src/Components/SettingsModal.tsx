import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { useNavigate } from "react-router";

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
        />
      </ListItem>
      <ListItem>
        <ListItemText
          onMouseOver={changeBackground}
          onMouseLeave={revertBackground}
          style={singleElementStyle}
          id="Invite-Teammates"
          primary="Invite Teammates"
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
        />
      </ListItem>
      <ListItem>
        <ListItemText
          onMouseOver={changeBackground}
          onMouseLeave={revertBackground}
          style={singleElementStyle}
          id="Logout"
          primary="Logout"
        />
      </ListItem>
    </List>
  );
}
