import React from "react";
import Select, { StylesConfig, ValueType } from "react-select";

type Option = {
    label: string;
    value: string;
};

type IsMulti = true;

interface MultiSelectProps {
    options: Option[];
    label: string;
    name: string;
    values: string[];
    onChange: (value: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, name, values, label, onChange }) => {
    const value = options.filter(option => values.includes(option.value));

    const customStyles: StylesConfig<Option, IsMulti> = {
        control: base => ({
            ...base,
            minHeight: 53,
            marginTop: 16,
        }),
    };

    const handleMultiChange = (value: ValueType<Option, IsMulti>) => {
        onChange(value.map(value => value.value));
    };

    return (
        <div style={{ marginTop: 16 }}>
            {label && (
                <label id={name} htmlFor={name} style={{ fontSize: 20, fontWeight: "bold" }}>
                    {label}
                </label>
            )}

            <Select
                aria-labelledby={name}
                inputId={name}
                defaultValue={value}
                isMulti
                name={name}
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={customStyles}
                onChange={handleMultiChange}
                textFieldProps={{
                    label,
                    InputLabelProps: {
                        shrink: true,
                    },
                }}
            />
        </div>
    );
};

export default React.memo(MultiSelect);
