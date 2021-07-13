import React from "react";
import Select, { StylesConfig, ValueType } from "react-select";

type Option = {
    label: string;
    value: string;
};

type IsMulti = true;

interface MultiSelectProps {
    options: Option[];
    name: string;
    values: string[];
    onChange: (value: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, name, values, onChange }) => {
    const value = options.filter(option => values.includes(option.value));

    const customStyles: StylesConfig<Option, IsMulti> = {
        control: base => ({
            ...base,
            height: 53,
            marginTop: 16,
        }),
    };

    const handleMultiChange = (value: ValueType<Option, IsMulti>) => {
        onChange(value.map(value => value.value));
    };

    console.log("render multiselect");

    return (
        <Select
            defaultValue={value}
            isMulti
            name={name}
            options={options}
            className="basic-multi-select"
            classNamePrefix="select"
            styles={customStyles}
            onChange={handleMultiChange}
        />
    );
};

export default React.memo(MultiSelect);
