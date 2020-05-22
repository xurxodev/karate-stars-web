import React, { useState } from "react";
import {
    Grid,
    makeStyles,
    Theme,
    CardContent,
    Card,
    Divider,
    CardHeader,
    CardActions,
    Button,
    TextField,
    Snackbar,
} from "@material-ui/core";
import { FormState, SelectOption } from "./FormState";
import MainLayout from "../../common/presentation/layouts/main/MainLayout";
import CompositionRoot from "../../CompositionRoot";
import { BlocBuilder } from "../../common/presentation/bloc";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(4),
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
    formControl: {
        //margin: theme.spacing(1),
        minWidth: 220,
    },
    textField: {
        marginTop: theme.spacing(2),
    },
}));

const SendPushNotificationContent: React.FC = () => {
    const classes = useStyles();
    const bloc = CompositionRoot.getInstance().provideSendPushNotificationBloc();
    const [resultState, setResultState] = useState<{ open: boolean; message: string }>({
        open: false,
        message: "",
    });
    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();

        bloc.onFieldChanged(event.target.name, event.target.value);
    };

    const handleSignIn = (event: any) => {
        event.preventDefault();
        bloc.submit();
    };

    return (
        <MainLayout>
            <div className={classes.root}>
                <BlocBuilder
                    bloc={bloc}
                    builder={(state: FormState) => {
                        return (
                            <Card>
                                <form autoComplete="off" noValidate onSubmit={handleSignIn}>
                                    <CardHeader title="Send push notification" />
                                    <Divider />
                                    <CardContent>
                                        <Grid container spacing={1}>
                                            <Grid item md={4} xs={12}>
                                                <TextField
                                                    className={classes.textField}
                                                    error={
                                                        state.fields["type"].errors &&
                                                        state.fields["type"].errors.length > 0
                                                    }
                                                    select={
                                                        state.fields["type"].selectOptions
                                                            ? true
                                                            : false
                                                    }
                                                    fullWidth={true}
                                                    label="Type"
                                                    name="type"
                                                    value={state.fields["type"].value || ""}
                                                    onChange={handleFieldChange}
                                                    SelectProps={{ native: true }}
                                                    helperText={
                                                        state.fields["type"].errors
                                                            ? state.fields["type"].errors.join("/n")
                                                            : ""
                                                    }
                                                    variant="outlined"
                                                >
                                                    {state.fields["type"].selectOptions &&
                                                        state.fields["type"].selectOptions.map(
                                                            (
                                                                option: SelectOption,
                                                                index: number
                                                            ) => {
                                                                return (
                                                                    <option
                                                                        key={index}
                                                                        value={option.id}
                                                                    >
                                                                        {option.name}
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                </TextField>
                                            </Grid>
                                            <Grid item md={4} xs={12}>
                                                <TextField
                                                    className={classes.textField}
                                                    select={
                                                        state.fields["mode"].selectOptions
                                                            ? true
                                                            : false
                                                    }
                                                    fullWidth={true}
                                                    label="Mode"
                                                    name="mode"
                                                    value={state.fields["mode"].value || ""}
                                                    onChange={handleFieldChange}
                                                    SelectProps={{ native: true }}
                                                    helperText={
                                                        state.fields["mode"].errors
                                                            ? state.fields["mode"].errors.join("/n")
                                                            : ""
                                                    }
                                                    variant="outlined"
                                                >
                                                    {state.fields["mode"].selectOptions &&
                                                        state.fields["mode"].selectOptions.map(
                                                            (
                                                                option: SelectOption,
                                                                index: number
                                                            ) => {
                                                                return (
                                                                    <option
                                                                        key={index}
                                                                        value={option.id}
                                                                    >
                                                                        {option.name}
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    className={classes.textField}
                                                    error={
                                                        state.fields["url"].errors &&
                                                        state.fields["url"].errors.length > 0
                                                    }
                                                    fullWidth={true}
                                                    helperText={
                                                        state.fields["url"].errors
                                                            ? state.fields["url"].errors.join("/n")
                                                            : ""
                                                    }
                                                    label="Url"
                                                    name="url"
                                                    onChange={handleFieldChange}
                                                    type="text"
                                                    value={state.fields["url"].value || ""}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    className={classes.textField}
                                                    error={
                                                        state.fields["title"].errors &&
                                                        state.fields["title"].errors.length > 0
                                                    }
                                                    fullWidth={true}
                                                    helperText={
                                                        state.fields["title"].errors
                                                            ? state.fields["title"].errors.join(
                                                                  "/n"
                                                              )
                                                            : ""
                                                    }
                                                    label="Title"
                                                    name="title"
                                                    onChange={handleFieldChange}
                                                    type="text"
                                                    value={state.fields["title"].value || ""}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    className={classes.textField}
                                                    fullWidth={true}
                                                    rows={5}
                                                    error={
                                                        state.fields["description"].errors &&
                                                        state.fields["description"].errors.length >
                                                            0
                                                    }
                                                    helperText={
                                                        state.fields["description"].errors
                                                            ? state.fields[
                                                                  "description"
                                                              ].errors.join("/n")
                                                            : ""
                                                    }
                                                    label="Description"
                                                    name="description"
                                                    onChange={handleFieldChange}
                                                    type="text"
                                                    value={state.fields["description"].value || ""}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            type="submit"
                                            disabled={!state.isValid}
                                        >
                                            Send
                                        </Button>
                                    </CardActions>
                                </form>
                                <Snackbar
                                    message={
                                        state.result && state.result.kind === "FormResultSuccess"
                                            ? state.result.message
                                            : ""
                                    }
                                    open={state.result && state.result.kind === "FormResultSuccess"}
                                    autoHideDuration={2000}
                                />
                            </Card>
                        );
                    }}
                />
            </div>
        </MainLayout>
    );
};

export default SendPushNotificationContent;
