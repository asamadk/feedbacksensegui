import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

const notificationMainStyle = {
    width: "100%",
    maxWidth: 360,
    bgcolor: "background.paper",
    position: "absolute",
    border: "1px #FFA500 solid",
    right: "10px",
    borderRadius: "5px",
    transition: "all .2s",
    zIndex : 10
};

const notificationData = [
    {
        header: 'Brunch this weekend?',
        secondaryText: 'Ali Connors',
        mainText: ` — I'll be in your neighborhood doing errands this…`
    },
    {
        header: 'Oui Oui',
        secondaryText: 'Ali Connors',
        mainText: ` — I'll be in your neighborhood doing errands this…`
    },
    {
        header: 'Summer BBQ',
        secondaryText: 'Ali Connors',
        mainText: ` — I'll be in your neighborhood doing errands this…`
    }
]

export default function NotificationModal() {
    React.useEffect(() => {
        console.log("Initializing notification modal component");
    }, []);

    return (
        <List sx={notificationMainStyle}>
            {
                notificationData.map(notify => {
                    return (
                        <>
                            <ListItem key={notify.header} alignItems="flex-start">
                                <ListItemText
                                    primary={notify.header}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: "inline" }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {notify.secondaryText}
                                            </Typography>
                                            {notify.mainText}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </>
                    )
                })
            }
        </List>
    );
}
