import React, { useCallback, useMemo } from "react";

import { FormSingleFieldState, SelectOption } from "../../state/FormState";
import {
    makeStyles,
    Grid,
    TextField,
    Theme,
    Button,
    Icon,
    Avatar,
    Box,
    Checkbox,
    FormControlLabel,
} from "@material-ui/core";
import TagsTextField from "./TagsTextField";
import { Autocomplete } from "@material-ui/lab";

type Option = {
    label: string;
    value: string;
};

interface FormFieldBuilderProps {
    field: FormSingleFieldState;
    handleFieldChange: (name: string, value: string | string[] | boolean) => void;
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
        } else if (event.target.type === "checkbox") {
            handleFieldChange(event.target.name, event.target.checked);
        } else {
            handleFieldChange(event.target.name, event.target.value);
        }
    };

    const handleMultiChange = useCallback((value: string[]) => {
        handleFieldChange(field.name, value);
    }, []);

    const handleAutoCompleteChange = (
        _event: React.ChangeEvent<any>,
        value: Option | Option[] | null
    ) => {
        if (Array.isArray(value)) {
            const values = value.map(value => value.value);
            handleFieldChange(field.name, values);
        } else {
            handleFieldChange(field.name, value?.value ?? "");
        }
    };

    const options = useMemo(
        () =>
            field.selectOptions
                ? field.selectOptions.map(option => ({
                      value: option.id,
                      label: option.name,
                  }))
                : undefined,
        [field.selectOptions]
    );

    const selectedOptions = useMemo(() => {
        const value = field.value;
        return Array.isArray(value) && value
            ? options?.filter(option => value.includes(option.value))
            : [];
    }, [options, field.value]);

    const selectedOption = useMemo(() => {
        const value = field.value as string | undefined;
        return options?.find(option => value === option.value) ?? null;
    }, [options, field.value]);

    switch (field.type) {
        case "file": {
            return (
                <Grid item md={field.md || defaultColumnValue} xs={field.xs || defaultColumnValue}>
                    <Box display="flex" alignItems="center" flexDirection="row">
                        {field.imageType === "image" ? (
                            <img
                                width={"40%"}
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
        case "checkbox": {
            return (
                <Grid item md={field.md || defaultColumnValue} xs={field.xs || defaultColumnValue}>
                    <FormControlLabel
                        style={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                            justifyContent: "center",
                        }}
                        control={
                            <Checkbox
                                checked={typeof field.value == "boolean" ? field.value : undefined}
                                onChange={handleChange}
                                name={field.name}
                            />
                        }
                        label={field.label}
                    />
                </Grid>
            );
        }
        default: {
            return (
                <Grid item md={field.md || defaultColumnValue} xs={field.xs || defaultColumnValue}>
                    {field.multiple && options && Array.isArray(field.value) ? (
                        <Autocomplete
                            style={{ marginTop: 16 }}
                            aria-labelledby={field.label.concat(field.required ? " (*)" : "")}
                            multiple
                            disablePortal
                            fullWidth={true}
                            getOptionLabel={option => option.label}
                            id={field.name}
                            options={options}
                            value={selectedOptions}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={field.label.concat(field.required ? " (*)" : "")}
                                    variant="outlined"
                                />
                            )}
                            onChange={handleAutoCompleteChange}
                        />
                    ) : !field.multiple && options ? (
                        <Autocomplete
                            style={{ marginTop: 16 }}
                            aria-labelledby={field.label.concat(field.required ? " (*)" : "")}
                            multiple={field.multiple}
                            disablePortal
                            fullWidth={true}
                            getOptionLabel={option => option.label}
                            id={field.name}
                            options={options}
                            value={selectedOption}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={field.label.concat(field.required ? " (*)" : "")}
                                    variant="outlined"
                                />
                            )}
                            onChange={handleAutoCompleteChange}
                        />
                    ) : field.multiple && !options && Array.isArray(field.value) ? (
                        <TagsTextField
                            values={field.value || []}
                            name={field.name}
                            label={field.label.concat(field.required ? " (*)" : "")}
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
                            type={field.type}
                            multiline={field.multiline}>
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
