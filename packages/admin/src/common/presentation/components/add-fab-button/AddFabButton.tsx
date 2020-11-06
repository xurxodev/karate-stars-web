import React from "react";
import { makeStyles, Fab, Theme } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme: Theme) => ({
    fab: {
        position: "fixed",
        bottom: theme.spacing(4),
        right: theme.spacing(4),
    },
}));

interface AddFabButtonProps {
    action: () => void;
}

const AddFabButton: React.FC<AddFabButtonProps> = ({ action }) => {
    const classes = useStyles();

    return (
        <Fab color="primary" aria-label="add" className={classes.fab} onClick={action}>
            <AddIcon />
        </Fab>
    );
};

export default AddFabButton;
