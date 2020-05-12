import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Divider, Drawer, Theme } from "@material-ui/core";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import SettingsIcon from "@material-ui/icons/Settings";
import Notifications from "@material-ui/icons/Notifications";
import VideoLibrary from "@material-ui/icons/VideoLibrary";

import SidebarNav from "./SidebarNav";
import Profile from "./Profile";
import { pages } from "../../../../app/AppRoutes";

const useStyles = makeStyles((theme: Theme) => ({
    drawer: {
        width: 240,
        [theme.breakpoints.up("lg")]: {
            marginTop: 64,
            height: "calc(100% - 64px)",
        },
    },
    root: {
        backgroundColor: theme.palette.common.white,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: theme.spacing(2),
    },
    divider: {
        margin: theme.spacing(2, 0),
    },
    nav: {
        marginBottom: theme.spacing(2),
    },
}));

interface SidebarProps {
    open: boolean;
    variant?: "permanent" | "persistent" | "temporary";
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, variant, onClose }) => {
    const classes = useStyles();

    const menus = [
        {
            ...pages.dashboard,
            icon: <DashboardIcon />,
        },
        {
            ...pages.competitors,
            icon: <PeopleIcon />,
        },
        {
            ...pages.videos,
            icon: <VideoLibrary />,
        },
        {
            ...pages.currentNewsSettings,
            icon: <SettingsIcon />,
        },
        {
            ...pages.socialNewsSettings,
            icon: <SettingsIcon />,
        },
        {
            ...pages.sendPushNotification,
            icon: <Notifications />,
        },
    ];

    return (
        <Drawer
            anchor="left"
            classes={{ paper: classes.drawer }}
            onClose={onClose}
            open={open}
            variant={variant}
        >
            <div className={classes.root}>
                <Profile />
                <Divider className={classes.divider} />
                <SidebarNav className={classes.nav} menus={menus} />
            </div>
        </Drawer>
    );
};

export default Sidebar;
