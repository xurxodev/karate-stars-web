import React, { useCallback, useMemo } from "react";

import { FormSingleFieldState, SelectOption } from "../../state/FormState";
import { makeStyles, Grid, TextField, Theme, Button, Icon, Avatar, Box } from "@material-ui/core";
import MultiSelect from "./MultiSelect";

interface FormFieldBuilderProps {
    field: FormSingleFieldState;
    handleFieldChange: (name: string, value: string | string[]) => void;
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

const FormSingleFieldBuilder: React.FC<FormFieldBuilderProps> = ({ field, handleFieldChange }) => {
    const classes = useStyles();
    const defaultColumnValue = 12;

    const handleChange = async (event: React.ChangeEvent<any>) => {
        event.persist();

        if (event.target.type === "file" && event.target.files) {
            const imageUrlPreview = await createPreviewUrl(event.target.files[0]);
            handleFieldChange(event.target.name, imageUrlPreview);
        } else if (event.target.type === "select-multiple" && event.target.selectedOptions) {
            handleFieldChange(
                event.target.name,
                Array.from(event.target.selectedOptions, (item: any) => item.value)
            );
        } else {
            handleFieldChange(event.target.name, event.target.value);
        }
    };

    const handleMultiChange = useCallback((value: string[]) => {
        handleFieldChange(field.name, value);
    }, []);

    const options = useMemo(
        () =>
            field.selectOptions
                ? field.selectOptions.map(option => ({
                      value: option.id,
                      label: option.name,
                  }))
                : undefined,
        []
    );

    switch (field.type) {
        case "file": {
            return (
                <Grid item md={field.md || defaultColumnValue} xs={field.xs || defaultColumnValue}>
                    <Box display="flex" alignItems="center" flexDirection="row">
                        {field.imageType === "image" ? (
                            <img
                                width={"150"}
                                style={{ borderRadius: "5%", marginRight: "16px" }}
                                src={field.value?.toString()}
                                alt={field.alt}
                            />
                        ) : (
                            <Avatar
                                className={classes.avatar}
                                src={field.value?.toString()}
                                alt={field.alt}
                            />
                        )}
                        <label htmlFor={field.name}>
                            <input
                                style={{ display: "none" }}
                                id={field.name}
                                name={field.name}
                                type="file"
                                onChange={handleChange}
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
                    {field.multiple && options && Array.isArray(field.value) ? (
                        <MultiSelect
                            values={field.value || []}
                            name={field.name}
                            label={field.label.concat(field.required ? " (*)" : "")}
                            options={options}
                            onChange={handleMultiChange}
                        />
                    ) : (
                        <TextField
                            id={field.name}
                            className={classes.textField}
                            error={field.errors && field.errors.length > 0}
                            select={field.selectOptions ? true : false}
                            fullWidth={true}
                            label={field.label.concat(field.required ? " (*)" : "")}
                            name={field.name}
                            value={field.value || ""}
                            onChange={handleChange}
                            SelectProps={{ native: true, multiple: field.multiple }}
                            helperText={field.errors ? field.errors.join("/n") : ""}
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            autoComplete={field.autoComplete}
                            inputProps={{ maxLength: field.maxLength }}
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
                    )}
                </Grid>
            );
        }
    }
};

export default FormSingleFieldBuilder;

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
