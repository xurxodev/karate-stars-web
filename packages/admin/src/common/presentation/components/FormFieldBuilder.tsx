import React from "react";

import { FormFieldState, SelectOption } from "../../../notifications/presentation/FormState";
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

    return (
        <Grid item md={field.md} xs={field.xs}>
            <TextField
                className={classes.textField}
                error={field.errors && field.errors.length > 0}
                select={field.selectOptions ? true : false}
                fullWidth={true}
                label={field.label}
                name={field.name}
                value={field.value || ""}
                onChange={handleFieldChange}
                SelectProps={{ native: true }}
                helperText={field.errors ? field.errors.join("/n") : ""}
                variant="outlined"
            >
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
