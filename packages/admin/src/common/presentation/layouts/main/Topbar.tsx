import React, { useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar, Badge, Hidden, IconButton, Theme } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import InputIcon from "@material-ui/icons/Input";
import { pages } from "../../../../app/Routes";
import logo from "../logo.png";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        boxShadow: "none",
    },
    flexGrow: {
        flexGrow: 1,
    },
    signOutButton: {
        marginLeft: theme.spacing(1),
    },
}));

interface TopbarProps {
    onSidebarOpen: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onSidebarOpen }) => {
    const classes = useStyles();

    const [notifications] = useState([]);

    return (
        <AppBar className={classes.root}>
            <Toolbar>
                <Link to={pages.dashboard.path}>
                    <img alt="Logo" src={logo} height={50} />
                </Link>
                <div className={classes.flexGrow} />
                <Hidden mdDown>
                    <IconButton color="inherit">
                        <Badge badgeContent={notifications.length} color="primary" variant="dot">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <IconButton className={classes.signOutButton} color="inherit">
                        <InputIcon />
                    </IconButton>
                </Hidden>
                <Hidden lgUp>
                    <IconButton color="inherit" onClick={onSidebarOpen}>
                        <MenuIcon />
                    </IconButton>
                </Hidden>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;
