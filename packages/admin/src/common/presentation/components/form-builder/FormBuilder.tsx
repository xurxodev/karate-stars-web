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
    Box,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import FormFieldBuilder from "./FormFieldBuilder";

interface FormBuilderProps {
    formState: FormState;
    onSubmit?: () => void;
    onCancel?: () => void;
    handleFieldChange: (name: string, value: string | string[]) => void;
    classes?: Record<string, string>;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
    onSubmit,
    onCancel,
    handleFieldChange,
    formState,
    classes,
}) => {
    const finalClasses = { ...useStyles(), ...classes };
    const defaultColumnValue = 12;

    const handleSubmit = (event: any) => {
        if (onSubmit) {
            event.preventDefault();
            onSubmit();
        }
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
    };

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
                                                section.fields
                                                    .filter(field => !field.hide === true)
                                                    .map((field: FormFieldState) => {
                                                        return (
                                                            <FormFieldBuilder
                                                                key={field.name}
                                                                field={field}
                                                                handleFieldChange={
                                                                    handleFieldChange
                                                                }
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
                <Box display="flex" flexDirection="row" justifyContent="flex-start">
                    <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                        disabled={!formState.isValid}
                        className={finalClasses.submitButton}
                        fullWidth={formState.submitfullWidth}>
                        {formState.submitName || "Send"}
                    </Button>
                    {formState.showCancel && (
                        <Button className={finalClasses.cancelButton} onClick={handleCancel}>
                            {formState.cancelName || "Cancel"}
                        </Button>
                    )}
                </Box>
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
    cancelButton: {
        margin: theme.spacing(2, 1),
    },
}));
