import React from "react";
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
    searchTerm: string;
    className?: string;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
    style?: React.CSSProperties;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchTerm, className, onChange, style }) => {
    const classes = useStyles();

    return (
        <Paper className={clsx(classes.root, className)} style={style}>
            <SearchIcon className={classes.icon} />
            <Input
                className={classes.input}
                disableUnderline
                onChange={onChange}
                placeholder="Search ..."
                value={searchTerm}
            />
        </Paper>
    );
};

export default SearchInput;
