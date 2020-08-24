import React from "react";

import { FormFieldState, SelectOption } from "../../state/FormState";
import { makeStyles, Grid, TextField, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
    textField: {
        marginTop: theme.spacing(2),
    },
}));

interface FormFieldBuilderProps {
    field: FormFieldState;
    handleFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormFieldBuilder: React.FC<FormFieldBuilderProps> = ({ field, handleFieldChange }) => {
    const classes = useStyles();
    const defaultColumnValue = 12;

    return (
        <Grid item md={field.md || defaultColumnValue} xs={field.xs || defaultColumnValue}>
            <TextField
                className={classes.textField}
                error={field.errors && field.errors.length > 0}
                select={field.selectOptions ? true : false}
                fullWidth={true}
                label={field.label.concat(field.required ? " (*)" : "")}
                name={field.name}
                value={field.value || ""}
                onChange={handleFieldChange}
                SelectProps={{ native: true }}
                helperText={field.errors ? field.errors.join("/n") : ""}
                variant="outlined">
                {field.selectOptions &&
                    field.selectOptions.map((option: SelectOption, index: number) => {
                        return (
                            <option key={index} value={option.id}>
                                {option.name}
                            </option>
                        );
                    })}
            </TextField>
        </Grid>
    );
};

export default FormFieldBuilder;
