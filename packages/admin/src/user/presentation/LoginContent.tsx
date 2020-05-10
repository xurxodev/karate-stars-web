import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid, Button, Typography, Theme, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import * as colors from "@material-ui/core/colors";
import background from "./images/login.png";

import { LoginState, LoginFormState } from "./LoginState";
import { useHistory } from "react-router-dom";
import { useLoginBloc } from "./LoginPage";
import { pages } from "../../app/Routes";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        height: "100%",
    },
    grid: {
        height: "100%",
    },
    quoteContainer: {
        backgroundColor: colors.blue[500],
        [theme.breakpoints.down("md")]: {
            display: "none",
        },
    },
    quote: {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
    },
    quoteInner: {
        textAlign: "center",
        flexBasis: "600px",
    },
    quoteText: {
        color: theme.palette.common.white,
        fontWeight: 300,
    },
    name: {
        marginTop: theme.spacing(3),
        color: theme.palette.common.white,
    },
    bio: {
        color: theme.palette.common.white,
    },
    logoImage: {
        marginLeft: theme.spacing(4),
    },
    contentContainer: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    content: {
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        [theme.breakpoints.down("md")]: {
            justifyContent: "center",
        },
    },
    formError: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    form: {
        paddingLeft: 100,
        paddingRight: 100,
        paddingBottom: 125,
        flexBasis: 700,
        [theme.breakpoints.down("sm")]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
    },
    title: {
        marginTop: theme.spacing(3),
    },
    textField: {
        marginTop: theme.spacing(2),
    },
    signInButton: {
        margin: theme.spacing(2, 0),
    },
}));

const LoginContent: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const loginBloc = useLoginBloc();

    const [state, setState] = useState<LoginState>(loginBloc.getState);

    loginBloc.subscribe((state: LoginState) => {
        switch (state.kind) {
            case "loginForm":
                return setState(state);
            case "loginOk":
                return history.push(pages.dashboard.path);
        }
    });

    const handleEmailChange = (event: any) => {
        event.persist();

        loginBloc.changeEmail(event.target.value);
    };

    const handlePaswwordChange = (event: any) => {
        event.persist();

        loginBloc.changePassword(event.target.value);
    };

    const handleSignIn = (event: any) => {
        event.preventDefault();
        loginBloc.login();
    };

    const stateForm = state as LoginFormState;

    return (
        <div className={classes.root}>
            <Grid className={classes.grid} container>
                <Grid className={classes.quoteContainer} item lg={5}>
                    <div className={classes.quote}>
                        <div className={classes.quoteInner}>
                            <Typography className={classes.quoteText} variant="h1">
                                Karate aims to build character, improve human behavior, and
                                cultivate modesty; it does not, however, guarantee it.
                            </Typography>
                            <div>
                                <Typography className={classes.name} variant="body1">
                                    Yasuhiro Konishi
                                </Typography>
                                <Typography className={classes.bio} variant="body2">
                                    Founder of Shindo Jinen-ryu
                                </Typography>
                            </div>
                        </div>
                    </div>
                </Grid>

                <Grid className={classes.contentContainer} item lg={7} xs={12}>
                    <div className={classes.content}>
                        <form className={classes.form} onSubmit={handleSignIn}>
                            <Typography className={classes.title} variant="h2">
                                Login
                            </Typography>
                            {stateForm.error && (
                                <Alert className={classes.formError} severity="error">
                                    {stateForm.error}
                                </Alert>
                            )}
                            <TextField
                                className={classes.textField}
                                error={stateForm.email.error ? true : false}
                                fullWidth
                                helperText={stateForm.email.error}
                                label="Email"
                                name="email"
                                onChange={handleEmailChange}
                                type="text"
                                value={stateForm?.email.value || ""}
                                variant="outlined"
                                autoComplete="username"
                            />
                            <TextField
                                className={classes.textField}
                                error={stateForm.password.error ? true : false}
                                fullWidth
                                helperText={stateForm?.password.error}
                                label="Password"
                                name="password"
                                onChange={handlePaswwordChange}
                                type="password"
                                value={stateForm?.password.value || ""}
                                variant="outlined"
                                autoComplete="current-password"
                            />
                            <Button
                                className={classes.signInButton}
                                color="primary"
                                disabled={!stateForm.isValid}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                            >
                                Sign in now
                            </Button>
                        </form>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default LoginContent;
