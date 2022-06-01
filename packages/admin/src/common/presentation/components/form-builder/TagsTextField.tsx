import { Chip, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";

interface TagsTextFieldProps {
    label: string;
    name: string;
    values: string[];
    onChange: (value: string[]) => void;
}

const TagsTextField: React.FC<TagsTextFieldProps> = ({ name, values, label, onChange }) => {
    const handleMultiChange = (_event: any, values: any) => {
        onChange(values);
    };

    return (
        <div style={{ marginTop: 16 }}>
            <Autocomplete
                multiple
                options={[]}
                freeSolo
                renderTags={(value: string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                        <Chip
                            key={index}
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                        />
                    ))
                }
                renderInput={params => <TextField {...params} variant="outlined" label={label} />}
                onChange={handleMultiChange}
                value={values}
            />
        </div>
    );
};

export default React.memo(TagsTextField);
