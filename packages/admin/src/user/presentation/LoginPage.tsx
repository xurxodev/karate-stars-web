import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid, Typography, Theme } from "@material-ui/core";
import background from "./images/login.png";
import { useAppBlocContext } from "../../app/AppContext";
import { BlocBuilder } from "../../common/presentation/bloc";
import { di } from "../../CompositionRoot";
import MinimalLayout from "../../common/presentation/layouts/minimal/MinimalLayout";
import { FormState } from "../../common/presentation/state/FormState";
import FormBuilder from "../../common/presentation/components/form-builder/FormBuilder";
import { pages } from "../../app/AppRoutes";
import { Redirect } from "react-router-dom";
import LoginBloc from "./LoginBloc";

const LoginPage: React.FC = () => {
    const classes = useStyles();
    const appBloc = useAppBlocContext();

    const loginBloc = di.get(LoginBloc);

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();

        loginBloc.onFieldChanged(event.target.name, event.target.value);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        loginBloc.submit();
    };

    return (
        <MinimalLayout>
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
                        <div>
                            <BlocBuilder
                                bloc={loginBloc}
                                builder={(formState: FormState) => {
                                    if (
                                        formState.result &&
                                        formState.result.kind === "FormResultSuccess"
                                    ) {
                                        appBloc.refresh();
                                        return <Redirect to={pages.dashboard.path} />;
                                    } else {
                                        return (
                                            <FormBuilder
                                                formState={formState}
                                                handleSubmit={handleSubmit}
                                                handleFieldChange={handleFieldChange}
                                                classes={{
                                                    form: classes.form,
                                                    formAlert: classes.formAlert,
                                                    title: classes.title,
                                                    submitButton: classes.submitButton,
                                                }}
                                            />
                                        );
                                    }
                                }}
                            />
                        </div>
                    </Grid>
                </Grid>
            </div>
        </MinimalLayout>
    );
};

export default LoginPage;

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        height: "100%",
    },
    grid: {
        height: "100%",
    },
    quoteContainer: {
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
        alignItems: "center",
    },
    formAlert: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    form: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    title: {
        marginTop: theme.spacing(3),
    },
    submitButton: {
        margin: theme.spacing(2, 0),
    },
}));
