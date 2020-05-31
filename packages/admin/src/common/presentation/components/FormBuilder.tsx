import React from "react";

import { FormState, FormFieldState } from "../../../notifications/presentation/FormState";
import {
    makeStyles,
    CardHeader,
    Divider,
    CardContent,
    Card,
    CardActions,
    Button,
    Grid,
    Theme,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import FormFieldBuilder from "./FormFieldBuilder";

const useStyles = makeStyles((theme: Theme) => ({
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
    submitButton: {
        margin: theme.spacing(0, 1),
    },
    formResult: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

interface FormBuilderProps {
    formState: FormState;
    handleSubmit: (event: any) => void;
    handleFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
    handleSubmit,
    handleFieldChange,
    formState,
}) => {
    const classes = useStyles();

    return (
        <Card>
            <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <CardHeader title={formState.title} />
                <Divider />
                <CardContent>
                    {formState.result && (
                        <Alert
                            className={classes.formResult}
                            severity={
                                formState.result.kind === "FormResultSuccess" ? "success" : "error"
                            }>
                            {formState.result.message}
                        </Alert>
                    )}
                    <Grid container spacing={1}>
                        {formState.fields &&
                            formState.fields.map((field: FormFieldState) => {
                                return (
                                    <FormFieldBuilder
                                        key={field.name}
                                        field={field}
                                        handleFieldChange={handleFieldChange}
                                    />
                                );
                            })}
                    </Grid>
                </CardContent>
                <CardActions>
                    <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                        disabled={!formState.isValid}
                        className={classes.submitButton}>
                        Send
                    </Button>
                </CardActions>
            </form>
        </Card>
    );
};

export default FormBuilder;
