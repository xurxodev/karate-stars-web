import React from "react";

import { FormComplexFieldState, FormSingleFieldState } from "../../state/FormState";
import { makeStyles, Grid, Theme, Typography } from "@material-ui/core";
import TableBuilder from "../table-builder/TableBuilder";
import ConfirmationDialog from "../confirmation-dialog/ConfirmationDialog";
import FormSingleFieldBuilder from "./FormSingleFieldBuilder";

interface FormFieldBuilderProps {
    field: FormComplexFieldState;
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

const FormComplexFieldBuilder: React.FC<FormFieldBuilderProps> = ({
    field,
    onChildrenListItemActionClick,
    onChildrenActionClick,
    onChildrenFormSave,
    onChildrenFormCancel,
    onChildrenFieldChange,
}) => {
    const classes = useStyles();

    const handleListItemActionClick = (actionName: string, id: string) => {
        if (onChildrenListItemActionClick) {
            onChildrenListItemActionClick(field.name, actionName, id);
        }
    };

    const handleChildrenActionClick = () => {
        if (onChildrenActionClick) {
            onChildrenActionClick(field.name);
        }
    };

    const handleChildrenFormSave = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (onChildrenFormSave) {
            onChildrenFormSave(field.name);
        }
    };

    const handleChildrenFormCancel = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (onChildrenFormCancel) {
            onChildrenFormCancel(field.name);
        }
    };

    const handleChildrenFieldChange = (name: string, value: string | string[] | boolean) => {
        if (onChildrenFieldChange) {
            onChildrenFieldChange(field.name, name, value);
        }
    };

    return (
        <Grid item md={12} xs={12}>
            <Typography variant="h4" component="h2" className={classes.title}>
                {field.listLabel.concat(field.required ? " (*)" : "")}
            </Typography>
            <TableBuilder
                actionAriaLabel={field.addActionLabel}
                state={field.list}
                classes={classes}
                onItemActionClick={handleListItemActionClick}
                onActionClick={handleChildrenActionClick}
            />

            {field.form && (
                <ConfirmationDialog
                    open={true}
                    title={field.form.title}
                    onSave={handleChildrenFormSave}
                    onCancel={handleChildrenFormCancel}
                    disableSave={!field.form.isValid}>
                    {field.form.fields
                        .filter(field => !field.hide === true)
                        .map((field: FormSingleFieldState) => {
                            return (
                                <FormSingleFieldBuilder
                                    key={field.name}
                                    field={field}
                                    handleFieldChange={handleChildrenFieldChange}
                                />
                            );
                        })}
                </ConfirmationDialog>
            )}
        </Grid>
    );
};

export default FormComplexFieldBuilder;

const useStyles = makeStyles((theme: Theme) => ({
    title: {
        marginTop: theme.spacing(2),
    },
    fab: {
        position: "relative",
        float: "right",
        top: theme.spacing(0),
        right: theme.spacing(4),
    },
}));
