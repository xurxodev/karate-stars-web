import React from "react";
import MinimalLayout from "../layouts/minimal/MinimalLayout";
import { Theme, makeStyles, Grid, Typography } from "@material-ui/core";
import notFoundLogo from "./not-found.png";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(4),
    },
    content: {
        paddingTop: 50,
        textAlign: "center",
    },
    image: {
        marginTop: 50,
        display: "inline-block",
        maxWidth: "100%",
        width: 560,
    },
}));

const NotFoundPage: React.FC = () => {
    const classes = useStyles();

    return (
        <MinimalLayout>
            <div className={classes.root}>
                <Grid container justify="center" spacing={4}>
                    <Grid item lg={6} xs={12}>
                        <div className={classes.content}>
                            <Typography variant="h1">
                                404: The page you are looking for isn’t here
                            </Typography>
                            <Typography variant="subtitle2">
                                You either tried some shady route or you came here by mistake.
                                Whichever it is, try using the navigation
                            </Typography>
                            <img
                                alt="Under development"
                                className={classes.image}
                                src={notFoundLogo}
                            />
                        </div>
                    </Grid>
                </Grid>
            </div>
        </MinimalLayout>
    );
};

export default NotFoundPage;
