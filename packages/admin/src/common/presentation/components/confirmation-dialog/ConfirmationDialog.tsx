import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    makeStyles,
    Typography,
} from "@material-ui/core";
import React, { ReactNode } from "react";

export interface ConfirmationDialogProps extends Partial<Omit<DialogProps, "title">> {
    isOpen?: boolean;
    title?: string | ReactNode;
    description?: string | ReactNode;
    onSave?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onCancel?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onInfoAction?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    saveText?: string;
    cancelText?: string;
    infoActionText?: string;
    disableSave?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    title = "",
    description,
    onSave,
    onCancel,
    onInfoAction,
    isOpen = false,
    children,
    cancelText = "Cancel",
    saveText = "OK",
    infoActionText = "Info",
    disableSave = false,
    ...other
}) => {
    const classes = useStyles();

    return (
        <Dialog open={isOpen} onClose={onCancel} {...other}>
            <DialogTitle disableTypography>
                <Typography variant="h4">{title}</Typography>
            </DialogTitle>

            <DialogContent>
                {description && renderNode(description)}
                {children}
            </DialogContent>

            <DialogActions>
                {onInfoAction && (
                    <Button
                        key={"info"}
                        className={classes.infoButton}
                        onClick={onInfoAction}
                        autoFocus>
                        {infoActionText}
                    </Button>
                )}
                {onCancel && (
                    <Button key={"cancel"} onClick={onCancel} autoFocus>
                        {cancelText}
                    </Button>
                )}
                {onSave && (
                    <Button key={"save"} onClick={onSave} color="primary" disabled={disableSave}>
                        {saveText}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

function renderNode(node: ReactNode) {
    if (typeof node === "string") {
        return node.split("\n").map((text, idx) => (
            <Typography key={idx} variant="body1">
                {text}
            </Typography>
        ));
    } else {
        return node;
    }
}

const useStyles = makeStyles({
    infoButton: { marginRight: "auto" },
});

export default ConfirmationDialog;
