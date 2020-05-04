import React, { useState, useEffect } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
//import validate from "validate.js";
import { makeStyles } from "@material-ui/styles";
import { Grid, Button, Typography, Theme, TextField } from "@material-ui/core";
import * as colors from "@material-ui/core/colors";
import background from "./login.png";

//import { Facebook as FacebookIcon, Google as GoogleIcon } from "icons";

const schema = {
    email: {
        presence: { allowEmpty: false, message: "is required" },
        email: true,
        length: {
            maximum: 64,
        },
    },
    password: {
        presence: { allowEmpty: false, message: "is required" },
        length: {
            maximum: 128,
        },
    },
};

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
        //backgroundColor: theme.palette.neutral,
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

const LoginPage: React.FC = () => {
    const history = useHistory();

    const classes = useStyles();

    // const [formState, setFormState] = useState({
    //     isValid: false,
    //     values: {},
    //     touched: {},
    //     errors: {},
    // });

    // useEffect(() => {
    //     const errors = validate(formState.values, schema);

    //     setFormState((formState) => ({
    //         ...formState,
    //         isValid: errors ? false : true,
    //         errors: errors || {},
    //     }));
    // }, [formState.values]);

    // const handleBack = () => {
    //     history.goBack();
    // };

    // const handleChange = (event: any) => {
    //     event.persist();

    //     setFormState((formState) => ({
    //         ...formState,
    //         values: {
    //             ...formState.values,
    //             [event.target.name]:
    //                 event.target.type === "checkbox" ? event.target.checked : event.target.value,
    //         },
    //         touched: {
    //             ...formState.touched,
    //             [event.target.name]: true,
    //         },
    //     }));
    // };

    const handleSignIn = (event: any) => {
        event.preventDefault();
        //history.push("/");
    };

    //const hasError = (field:any) =>
    // formState.touched[field] && formState.errors[field] ? true : false;

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
                            <TextField
                                className={classes.textField}
                                //error={hasError("email")}
                                fullWidth
                                //helperText={hasError("email") ? formState.errors.email[0] : null}
                                label="Email address"
                                name="email"
                                //onChange={handleChange}
                                type="text"
                                //value={formState.values.email || ""}
                                variant="outlined"
                            />
                            <TextField
                                className={classes.textField}
                                //error={hasError("password")}
                                fullWidth
                                // helperText={
                                //     hasError("password") ? formState.errors.password[0] : null
                                // }
                                label="Password"
                                name="password"
                                //onChange={handleChange}
                                type="password"
                                //value={formState.values.password || ""}
                                variant="outlined"
                            />
                            <Button
                                className={classes.signInButton}
                                color="primary"
                                //disabled={!formState.isValid}
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

        //     <Grid className={classes.grid} container>

        //     </Grid>
    );
};

export default LoginPage;
