import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Avatar, Typography, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "fit-content",
    },
    avatar: {
        width: 60,
        height: 60,
    },
    name: {
        marginTop: theme.spacing(1),
    },
}));

const Profile: React.FC = () => {
    const classes = useStyles();

    const user = {
        name: "Jorge Sánnchez",
        avatar: "https://pbs.twimg.com/profile_images/1151113544362078209/chgA6VO9_400x400.jpg",
        bio: "Admin",
    };

    return (
        <div className={classes.root}>
            <Avatar alt="Person" className={classes.avatar} src={user.avatar} />
            <Typography className={classes.name} variant="h4">
                {user.name}
            </Typography>
            <Typography variant="body2">{user.bio}</Typography>
        </div>
    );
};

export default Profile;
