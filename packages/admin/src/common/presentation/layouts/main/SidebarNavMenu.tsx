/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import { ListItem, Button, colors, Theme } from "@material-ui/core";
import clsx from "clsx";
import { MenuLeaf } from "./SidebarNav";

interface SidebarNavProps {
    className?: string;
    menu: MenuLeaf;
}

const SidebarNavMenu: React.FC<SidebarNavProps> = ({ menu, className }) => {
    const classes = useStyles(menu.level);

    return (
        <ListItem
            className={clsx(classes.root, className)}
            disableGutters
            style={{ paddingLeft: menu.level * 8 }}>
            <Button
                activeClassName={classes.active}
                className={classes.button}
                component={NavLink}
                to={menu.path}
                exact={true}>
                <div className={classes.icon}>{menu.icon}</div>
                {menu.title}
            </Button>
        </ListItem>
    );
};

export default SidebarNavMenu;

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(0),
    },
    button: {
        color: colors.blueGrey[800],
        padding: "10px 8px",
        justifyContent: "flex-start",
        textTransform: "none",
        letterSpacing: 0,
        width: "100%",
        //fontWeight: theme.typography.fontWeightMedium,
    },
    icon: {
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        marginRight: theme.spacing(1),
    },
    active: {
        color: theme.palette.primary.main,
        //fontWeight: theme.typography.fontWeightMedium,
        "& $icon": {
            color: theme.palette.primary.main,
        },
    },
}));
