import { ListAction } from "../state/ListState";

export const editAction = {
    name: "edit",
    text: "Edit",
    icon: "edit",
    multiple: false,
    primary: true,
    active: true,
};

export const deleteAction = {
    name: "delete",
    text: "Delete",
    icon: "delete",
    multiple: true,
    primary: false,
    active: true,
};

export const duplicateAction = {
    name: "duplicate",
    text: "Duplicate",
    icon: "content_copy",
    multiple: false,
    primary: false,
    active: true,
};

export const basicActions: ListAction[] = [editAction, deleteAction];
