import React, { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Paper, Input, Theme } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        borderRadius: "4px",
        alignItems: "center",
        padding: theme.spacing(1),
        display: "flex",
        flexBasis: 420,
    },
    icon: {
        marginRight: theme.spacing(1),
        color: theme.palette.text.secondary,
    },
    input: {
        flexGrow: 1,
        fontSize: "14px",
        lineHeight: "16px",
        letterSpacing: "-0.05px",
    },
}));

interface SearchInputProps {
    value: string;
    className?: string;
    onChange?: (value: string) => void;
    style?: React.CSSProperties;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, className, onChange, style }) => {
    const classes = useStyles();

    const [stateValue, updateStateValue] = useState(value);
    useEffect(() => updateStateValue(value), [value]);

    const onChangeDebounced = useCallback(
        debounce((value: string) => {
            if (onChange) onChange(value);
        }, 400),
        [onChange]
    );

    const onKeyUp = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            onChangeDebounced(value);
            updateStateValue(value);
        },
        [onChangeDebounced, updateStateValue]
    );

    return (
        <Paper className={clsx(classes.root, className)} style={style}>
            <SearchIcon className={classes.icon} />
            <Input
                className={classes.input}
                disableUnderline
                onChange={onKeyUp}
                placeholder="Search ..."
                value={stateValue}
            />
        </Paper>
    );
};

export default SearchInput;

function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const debounced = (...args: Parameters<F>) => {
        if (timeout !== null) {
            clearTimeout(timeout);
            timeout = null;
        }
        timeout = setTimeout(() => func(...args), waitFor);
    };

    return debounced as (...args: Parameters<F>) => ReturnType<F>;
}
