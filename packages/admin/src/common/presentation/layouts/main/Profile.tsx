import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Avatar, Typography, Theme } from "@material-ui/core";
import { useAppBlocContext } from "../../../../app/AppContext";
import { BlocBuilder } from "../../bloc";
import AppState from "../../../../app/AppState";

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
    const appBloc = useAppBlocContext();

    return (
        <BlocBuilder
            bloc={appBloc}
            builder={(state: AppState) => {
                const { currentUser } = state;

                return (
                    <div className={classes.root}>
                        <Avatar alt="Person" className={classes.avatar} src={currentUser?.image} />
                        <Typography className={classes.name} variant="h4">
                            {currentUser?.name}
                        </Typography>
                        <Typography variant="body2">
                            {currentUser?.isAdmin ? "Admin" : ""}
                        </Typography>
                    </div>
                );
            }}
        />
    );
};

export default Profile;
