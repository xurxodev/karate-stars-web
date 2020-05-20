import React from "react";
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
} from "@material-ui/core";
import { FormState } from "./FormState";
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

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();

        bloc.onFieldChanged(event.target.name, event.target.value);
    };

    return (
        <MainLayout>
            <div className={classes.root}>
                <Card>
                    <form autoComplete="off">
                        <CardHeader title="Send push notification" />
                        <Divider />
                        <CardContent>
                            <BlocBuilder
                                bloc={bloc}
                                builder={(state: FormState) => {
                                    return (
                                        <Grid container spacing={1}>
                                            <Grid item md={4} xs={12}>
                                                <TextField
                                                    className={classes.textField}
                                                    select={true}
                                                    fullWidth={true}
                                                    required={true}
                                                    label="Type"
                                                    name="type"
                                                    //value={currency}
                                                    //onChange={handleChange}
                                                    SelectProps={{ native: true }}
                                                    //helperText="Error helper"
                                                    variant="outlined"
                                                >
                                                    <option key={0} value={0}>
                                                        News
                                                    </option>
                                                    <option key={1} value={1}>
                                                        Competitors
                                                    </option>
                                                    <option key={2} value={2}>
                                                        Videos
                                                    </option>
                                                </TextField>
                                            </Grid>
                                            <Grid item md={4} xs={12}>
                                                <TextField
                                                    className={classes.textField}
                                                    select={true}
                                                    fullWidth={true}
                                                    required={true}
                                                    label="Mode"
                                                    name="mode"
                                                    //value={currency}
                                                    //onChange={handleChange}
                                                    SelectProps={{ native: true }}
                                                    //helperText="Error helper"
                                                    variant="outlined"
                                                >
                                                    <option key={0} value={0}>
                                                        Debug
                                                    </option>
                                                    <option key={1} value={1}>
                                                        Real
                                                    </option>
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
                                                    required={true}
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
                                                    //error={stateForm.email.error ? true : false}
                                                    fullWidth={true}
                                                    required={true}
                                                    //helperText={stateForm.email.error}
                                                    label="Title"
                                                    name="title"
                                                    //onChange={handleEmailChange}
                                                    type="text"
                                                    //value={stateForm?.email.value || ""}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    className={classes.textField}
                                                    fullWidth={true}
                                                    required={true}
                                                    rows={5}
                                                    //error={stateForm.email.error ? true : false}
                                                    //helperText={stateForm.email.error}
                                                    label="Description"
                                                    name="description"
                                                    //onChange={handleEmailChange}
                                                    type="text"
                                                    //value={stateForm?.email.value || ""}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>
                                    );
                                }}
                            />
                        </CardContent>
                        <CardActions>
                            <Button color="primary" variant="contained" type="submit">
                                Send
                            </Button>
                        </CardActions>
                    </form>
                </Card>
            </div>
        </MainLayout>
    );
};

export default SendPushNotificationContent;
