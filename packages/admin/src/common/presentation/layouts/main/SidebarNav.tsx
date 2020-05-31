/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import { List, ListItem, Button, colors, Theme } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    item: {
        display: "flex",
        paddingTop: 0,
        paddingBottom: 0,
    },
    button: {
        color: colors.blueGrey[800],
        padding: "10px 8px",
        justifyContent: "flex-start",
        textTransform: "none",
        letterSpacing: 0,
        width: "100%",
        fontWeight: theme.typography.fontWeightMedium,
    },
    icon: {
        // color: theme.palette.icon,
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        marginRight: theme.spacing(1),
    },
    active: {
        color: theme.palette.primary.main,
        fontWeight: theme.typography.fontWeightMedium,
        "& $icon": {
            color: theme.palette.primary.main,
        },
    },
}));

//TODO: review  forwardRef
// const CustomRouterLink = forwardRef((props, ref) => (
//   <div
//     ref={ref}
//     style={{ flexGrow: 1 }}
//   >
//     <NavLink {...props} />
//   </div>
// ));

interface menu {
    title: string;
    path: string;
    icon: any;
}

interface SidebarNavProps {
    className: string;
    menus: menu[];
}

const SidebarNav: React.FC<SidebarNavProps> = ({ menus, className }) => {
    const classes = useStyles();

    return (
        <List className={clsx(classes.root, className)}>
            {menus.map(menu => (
                <ListItem className={classes.item} disableGutters key={menu.title}>
                    <Button
                        activeClassName={classes.active}
                        className={classes.button}
                        component={NavLink}
                        to={menu.path}>
                        <div className={classes.icon}>{menu.icon}</div>
                        {menu.title}
                    </Button>
                </ListItem>
            ))}
        </List>
    );
};

export default SidebarNav;
