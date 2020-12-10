import React, { useEffect, useState } from "react";

import { FormFieldState, SelectOption } from "../../state/FormState";
import { makeStyles, Grid, TextField, Theme, Button, Icon, Avatar, Box } from "@material-ui/core";

interface FormFieldBuilderProps {
    field: FormFieldState;
    handleFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const createPreviewUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = function () {
            if (reader.result) {
                resolve(reader.result as string);
            } else {
                reject();
            }
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            resolve("");
        }
    });
};

const FormFieldBuilder: React.FC<FormFieldBuilderProps> = ({ field, handleFieldChange }) => {
    const classes = useStyles();
    const defaultColumnValue = 12;

    const [imageUrl, setImageUrl] = useState<string>();

    useEffect(() => {
        if (field.value instanceof File) {
            createPreviewUrl(field.value).then(setImageUrl);
        } else {
            setImageUrl(field.value);
        }
    }, [field.value]);

    switch (field.type) {
        case "file": {
            return (
                <Grid item md={field.md || defaultColumnValue} xs={field.xs || defaultColumnValue}>
                    <Box display="flex" alignItems="center" flexDirection="row">
                        <Avatar className={classes.avatar} src={imageUrl} />
                        <label htmlFor={field.name}>
                            <input
                                style={{ display: "none" }}
                                id={field.name}
                                name={field.name}
                                type="file"
                                onChange={handleFieldChange}
                                accept={field.accept}
                            />
                            <Button color="secondary" variant="contained" component="span">
                                <Icon>add</Icon> {field.label}
                            </Button>
                        </label>
                    </Box>
                </Grid>
            );
        }
        default: {
            return (
                <Grid item md={field.md || defaultColumnValue} xs={field.xs || defaultColumnValue}>
                    <TextField
                        id={field.name}
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
                        variant="outlined"
                        autoComplete={field.autoComplete}
                        type={field.type}>
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
        }
    }
};

export default FormFieldBuilder;

const useStyles = makeStyles((theme: Theme) => ({
    textField: {
        marginTop: theme.spacing(2),
    },
    avatar: {
        width: 100,
        height: 100,
        marginRight: theme.spacing(2),
    },
}));
