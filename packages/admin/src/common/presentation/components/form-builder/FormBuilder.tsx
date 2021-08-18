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
import FormSingleFieldBuilder from "./FormSingleFieldBuilder";
import FormComplexFieldBuilder from "./FormComplexFieldBuilder";

interface FormBuilderProps {
    formState: FormState;
    onSubmit?: () => void;
    onCancel?: () => void;
    handleFieldChange: (name: string, value: string | string[] | boolean) => void;
    classes?: Record<string, string>;
    onChildrenListItemActionClick?: (field: string, actionName: string, id: string) => void;
    onChildrenActionClick?: (field: string) => void;
    onChildrenFormSave?: (field: string) => void;
    onChildrenFormCancel?: (field: string) => void;
    onChildrenFieldChange?: (
        field: string,
        name: string,
        value: string | string[] | boolean
    ) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
    onSubmit,
    onCancel,
    handleFieldChange,
    onChildrenListItemActionClick,
    onChildrenActionClick,
    onChildrenFormSave,
    onChildrenFormCancel,
    onChildrenFieldChange,
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

    const renderField = (field: FormFieldState) => {
        switch (field.kind) {
            case "FormSingleFieldState": {
                return (
                    <FormSingleFieldBuilder
                        key={field.name}
                        field={field}
                        handleFieldChange={handleFieldChange}
                    />
                );
            }
            case "FormComplexFieldState": {
                return (
                    <FormComplexFieldBuilder
                        key={field.name}
                        field={field}
                        onChildrenListItemActionClick={onChildrenListItemActionClick}
                        onChildrenActionClick={onChildrenActionClick}
                        onChildrenFormSave={onChildrenFormSave}
                        onChildrenFormCancel={onChildrenFormCancel}
                        onChildrenFieldChange={onChildrenFieldChange}
                    />
                );
            }
        }
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
                                                        return renderField(field);
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
