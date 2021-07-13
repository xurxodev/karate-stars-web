import React from "react";
import { makeStyles, Fab, Theme } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: "fixed",
        bottom: theme.spacing(4),
        right: theme.spacing(4),
    },
}));

interface AddFabButtonProps {
    action: () => void;
    className?: string;
}

const AddFabButton: React.FC<AddFabButtonProps> = ({ action, className }) => {
    const classes = useStyles();

    return (
        <Fab
            color="primary"
            aria-label="add"
            className={clsx(classes.root, className)}
            onClick={action}>
            <AddIcon />
        </Fab>
    );
};

export default AddFabButton;
