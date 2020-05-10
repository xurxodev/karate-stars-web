import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar } from "@material-ui/core";
import logo from "../logo.png";

const useStyles = makeStyles(() => ({
    root: {
        boxShadow: "none",
    },
}));

const Topbar: React.FC = () => {
    const classes = useStyles();

    return (
        <AppBar className={classes.root} color="primary" position="fixed">
            <Toolbar>
                <RouterLink to="/admin">
                    <img alt="Logo" src={logo} height={50} />
                </RouterLink>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;
