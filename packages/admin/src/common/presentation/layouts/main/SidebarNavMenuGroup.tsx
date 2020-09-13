/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React from "react";
import { makeStyles } from "@material-ui/styles";
import { List, ListItem, Theme, Collapse, Button, colors } from "@material-ui/core";
import clsx from "clsx";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { MenuGroup } from "./SidebarNav";
import SidebarNavMenu from "./SidebarNavMenu";

interface SidebarNavProps {
    className?: string;
    menu: MenuGroup;
}

const SidebarNavMenuGroup: React.FC<SidebarNavProps> = ({ menu, className }) => {
    const classes = useStyles(menu.level);

    const [openCollapse, setOpenCollapse] = React.useState(false);

    const handleExpand = () => {
        setOpenCollapse(!openCollapse);
    };

    return (
        <React.Fragment>
            <ListItem
                className={clsx(classes.root, className)}
                onClick={handleExpand}
                disableGutters
                style={{ paddingLeft: menu.level * 8 }}>
                <Button className={classes.button} fullWidth={true}>
                    <div className={classes.icon}>{menu.icon}</div>
                    <span className={classes.title}>{menu.title}</span>
                    {openCollapse ? <ExpandLess /> : <ExpandMore />}
                </Button>
                {/* <ListItemIcon>{menu.icon}</ListItemIcon>
                <ListItemText primary={menu.title} /> */}
            </ListItem>
            <Collapse in={openCollapse} timeout="auto" unmountOnExit key={menu.title}>
                <List component="div" disablePadding>
                    {menu.children &&
                        menu.children.map(child =>
                            child.kind === "MenuGroup" ? (
                                <SidebarNavMenuGroup menu={child} key={child.title} />
                            ) : (
                                <SidebarNavMenu menu={child} key={child.title} />
                            )
                        )}
                </List>
            </Collapse>
        </React.Fragment>
    );
};

export default SidebarNavMenuGroup;

const useStyles = makeStyles((theme: Theme) => ({
    root: { padding: theme.spacing(0) },
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
    title: {
        textAlign: "start",
        flexGrow: 1,
    },
}));
