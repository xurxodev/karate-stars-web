import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Divider, Drawer, Theme, Button, colors, Hidden } from "@material-ui/core";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import Notifications from "@material-ui/icons/Notifications";
import VideoLibrary from "@material-ui/icons/VideoLibrary";
import InputIcon from "@material-ui/icons/Input";
import EventNoteIcon from "@material-ui/icons/EventNote";
import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";
import EventIcon from "@material-ui/icons/Event";
import CategoryIcon from "@material-ui/icons/Category";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ListIcon from "@material-ui/icons/List";
import FlagIcon from "@material-ui/icons/Flag";

import SidebarNav, { Menu } from "./SidebarNav";
import Profile from "./Profile";
import { useAppBlocContext } from "../../../../app/AppContext";
import { Description, RssFeed } from "@material-ui/icons";
import { pages } from "../../PageRoutes";

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
    logoutButton: {
        color: colors.blueGrey[800],
        padding: "10px 8px",
        justifyContent: "flex-start",
        textTransform: "none",
        letterSpacing: 0,
        width: "100%",
        //fontWeight: theme.typography.fontWeightMedium,
    },
    logoutIcon: {
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        marginRight: theme.spacing(1),
    },
    flexGrow: {
        flexGrow: 1,
    },
}));

interface SidebarProps {
    open: boolean;
    variant?: "permanent" | "persistent" | "temporary";
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, variant, onClose }) => {
    const classes = useStyles();
    const appBloc = useAppBlocContext();

    const handleLogout = () => appBloc.logout();

    const menus: Menu[] = [
        {
            kind: "MenuLeaf",
            level: 0,
            ...pages.dashboard,
            icon: <DashboardIcon />,
        },
        {
            kind: "MenuGroup",
            level: 0,
            title: "Categories",
            icon: <CategoryIcon />,
            children: [
                {
                    kind: "MenuLeaf",
                    level: 0,
                    ...pages.categoryList,
                    icon: <ListAltIcon />,
                },
                {
                    kind: "MenuLeaf",
                    level: 0,
                    ...pages.categoryTypeList,
                    icon: <ListIcon />,
                },
            ],
        },
        {
            kind: "MenuLeaf",
            level: 0,
            ...pages.competitorList,
            icon: <PeopleIcon />,
        },
        {
            kind: "MenuLeaf",
            level: 0,
            ...pages.countryList,
            icon: <FlagIcon />,
        },
        {
            kind: "MenuGroup",
            level: 0,
            title: "Events",
            icon: <EmojiEventsIcon />,
            children: [
                {
                    kind: "MenuLeaf",
                    level: 0,
                    ...pages.eventList,
                    icon: <EventIcon />,
                },
                {
                    kind: "MenuLeaf",
                    level: 0,
                    ...pages.eventTypeList,
                    icon: <EventNoteIcon />,
                },
            ],
        },
        {
            kind: "MenuGroup",
            level: 0,
            title: "News",
            icon: <Description />,
            children: [
                // {
                //     kind: "MenuLeaf",
                //     level: 1,
                //     title: pages.newsFeedDetail.title,
                //     path: (pages.newsFeedDetail as DetailPageConfig).generateUrl({ action: "new" }),
                //     icon: <RssFeed />,
                // },
                {
                    kind: "MenuLeaf",
                    level: 1,
                    ...pages.newsFeedList,
                    icon: <RssFeed />,
                },
            ],
        },
        {
            kind: "MenuGroup",
            level: 0,
            title: "Notifications",
            icon: <Notifications />,
            children: [
                {
                    kind: "MenuLeaf",
                    level: 0,
                    ...pages.sendPushNotification,
                    icon: <Description />,
                },
            ],
        },
        {
            kind: "MenuLeaf",
            level: 0,
            ...pages.videoList,
            icon: <VideoLibrary />,
        },
    ];

    return (
        <Drawer
            anchor="left"
            classes={{ paper: classes.drawer }}
            onClose={onClose}
            open={open}
            variant={variant}>
            <div className={classes.root}>
                <Profile />
                <Divider className={classes.divider} />
                <SidebarNav className={classes.nav} menus={menus} />

                <div className={classes.flexGrow} />

                <Hidden lgUp>
                    <Button className={classes.logoutButton} onClick={handleLogout}>
                        <div className={classes.logoutIcon}>
                            <InputIcon />
                        </div>
                        {"Logout"}
                    </Button>
                </Hidden>
            </div>
        </Drawer>
    );
};

export default Sidebar;
