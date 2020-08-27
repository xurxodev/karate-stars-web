import React from "react";

import { FormState, FormFieldState } from "../../state/FormState";
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

interface FormBuilderProps {
    formState: FormState;
    handleSubmit: (event: any) => void;
    handleFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    classes?: Record<string, string>;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
    handleSubmit,
    handleFieldChange,
    formState,
    classes,
}) => {
    const finalClasses = { ...useStyles(), ...classes };

    return (
        <Card>
            <form
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
                className={finalClasses.form}>
                <CardHeader title={formState.title} />
                <Divider />
                <CardContent>
                    {formState.result && (
                        <Alert
                            className={finalClasses.formAlert}
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
                        className={finalClasses.submitButton}
                        fullWidth={formState.submitfullWidth}>
                        {formState.submitName || "Send"}
                    </Button>
                </CardActions>
            </form>
        </Card>
    );
};

export default FormBuilder;

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
    form: {},
    formAlert: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    submitButton: {
        margin: theme.spacing(0, 1),
    },
}));
