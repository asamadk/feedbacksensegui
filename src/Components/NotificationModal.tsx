import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";

const notificationMainStyle = {
    width: "100%",
    maxWidth: 360,
    bgcolor: "background.paper",
    position: "absolute",
    right: "10px",
    borderRadius: "5px",
    transition: "all .2s",
    zIndex: 10,
    color : '#f1f1f1'
};

const notificationData = [
    {
        header: 'Welcome to your personal notification center!',
        mainText: `  Here, you'll find all the important updates and information you need`
    },
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
