import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Typography, Link, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(4),
    },
}));

const Footer: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography variant="body1">
                &copy;{" "}
                <Link component="a" href="http://karatestarsap.com" target="_blank">
                    Karate stars
                </Link>{" "}
                2021
            </Typography>
            <Typography variant="caption">Created by xurxodev</Typography>
        </div>
    );
};

export default Footer;
