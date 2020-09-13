/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React from "react";
import { makeStyles } from "@material-ui/styles";
import { List, Theme } from "@material-ui/core";
import clsx from "clsx";
import SidebarNavMenu from "./SidebarNavMenu";
import SidebarNavMenuGroup from "./SidebarNavMenuGroup";

//TODO: review  forwardRef
// const CustomRouterLink = forwardRef((props, ref) => (
//   <div
//     ref={ref}
//     style={{ flexGrow: 1 }}
//   >
//     <NavLink {...props} />
//   </div>
// ));

export interface MenuGroup {
    kind: "MenuGroup";
    level: number;
    title: string;
    icon?: any;
    children?: Menu[];
}

export interface MenuLeaf {
    kind: "MenuLeaf";
    level: number;
    title: string;
    path: string;
    icon?: any;
}

export type Menu = MenuGroup | MenuLeaf;

interface SidebarNavProps {
    className: string;
    menus: Menu[];
}

const SidebarNav: React.FC<SidebarNavProps> = ({ menus, className }) => {
    const classes = useStyles();

    return (
        <List className={clsx(classes.root, className)}>
            {menus.map(menu =>
                menu.kind === "MenuGroup" ? (
                    <SidebarNavMenuGroup menu={menu} key={menu.title} />
                ) : (
                    <SidebarNavMenu menu={menu} key={menu.title} />
                )
            )}
        </List>
    );
};

export default SidebarNav;

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(0),
    },
}));
