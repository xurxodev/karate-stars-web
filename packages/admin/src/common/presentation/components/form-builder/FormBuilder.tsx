import React from "react";

import { FormState, FormFieldState, FormSectionState } from "../../state/FormState";
import {
    makeStyles,
    CardHeader,
    Divider,
    CardContent,
    Card,
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
    const defaultColumnValue = 12;

    return (
        <React.Fragment>
            {formState.result && (
                <Alert
                    className={finalClasses.formAlert}
                    severity={formState.result.kind === "FormResultSuccess" ? "success" : "error"}>
                    {formState.result.message}
                </Alert>
            )}

            <form
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
                className={finalClasses.form}>
                <Grid container spacing={1}>
                    {formState.sections.map((section: FormSectionState, index: number) => {
                        return (
                            <Grid
                                item
                                md={section.md || defaultColumnValue}
                                xs={section.xs || defaultColumnValue}
                                key={index}>
                                <Card>
                                    {section.title && <CardHeader title={section.title} />}
                                    {section.title && <Divider />}
                                    <CardContent>
                                        <Grid container spacing={1}>
                                            {section.fields &&
                                                section.fields.map((field: FormFieldState) => {
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
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
                <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    disabled={!formState.isValid}
                    className={finalClasses.submitButton}
                    fullWidth={formState.submitfullWidth}>
                    {formState.submitName || "Send"}
                </Button>
            </form>
        </React.Fragment>
    );
};

export default FormBuilder;

const useStyles = makeStyles((theme: Theme) => ({
    form: {
        paddingRight: theme.spacing(0),
        paddingLeft: theme.spacing(0),
    },
    formAlert: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    submitButton: {
        margin: theme.spacing(2, 0),
    },
}));
