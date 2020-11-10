import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { Icon, PopoverPosition } from "@material-ui/core";

export interface MenuItemData {
    name: string;
    text: string;
    icon?: string;
}

export interface ContextualMenuProps<> {
    isOpen: boolean;
    position: PopoverPosition;
    onClose(): void;
    menus: MenuItemData[];
    onMenuSelected: (name: string) => void;
}

const ContextualMenu: React.FC<ContextualMenuProps> = ({
    isOpen,
    position,
    onClose,
    menus,
    onMenuSelected,
}) => {
    const classes = useStyles();

    return (
        <Menu
            className={classes.root}
            open={isOpen}
            anchorReference="anchorPosition"
            disableScrollLock={true}
            anchorPosition={position}
            onClose={onClose}>
            {menus.map(menu => (
                <MenuItem
                    className={classes.item}
                    key={menu.name}
                    onClick={() => onMenuSelected(menu.name)}>
                    {menu.icon && (
                        <div className={classes.icon}>
                            <Icon>{menu.icon}</Icon>
                        </div>
                    )}

                    <Typography className={classes.text} noWrap>
                        {menu.text}
                    </Typography>
                </MenuItem>
            ))}
        </Menu>
    );
};

const useStyles = makeStyles({
    root: {
        position: "fixed",
    },
    item: {
        paddingTop: "8px",
        paddingBottom: "8px",
    },
    icon: {
        display: "flex",
        paddingLeft: "6px",
        paddingRight: "10px",
    },
    text: {
        paddingLeft: "10px",
        paddingRight: "15px",
    },
});

export default ContextualMenu;
