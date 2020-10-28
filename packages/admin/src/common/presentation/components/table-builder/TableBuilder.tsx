import React from "react";
import { Avatar, CircularProgress, makeStyles } from "@material-ui/core";
import { ListField, ListState } from "../../state/ListState";
import { Alert } from "@material-ui/lab";
import DataTable, { TableColumn } from "../data-table/DataTable";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
    loading: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
});

interface TableBuilderProps<T extends IdentifiableObject> {
    className?: string;
    state: ListState<T>;
    search?: string;
    onSearchChange?: (search: string) => void;
}

interface IdentifiableObject {
    id: string;
}

export default function TableBuilder<T extends IdentifiableObject>({
    state,
    onSearchChange,
}: TableBuilderProps<T>) {
    const classes = useStyles();

    switch (state.kind) {
        case "ListLoadingState": {
            return (
                <div className={classes.loading}>
                    <CircularProgress />
                </div>
            );
        }
        case "ListErrorState": {
            return <Alert severity="error">{state.message}</Alert>;
        }
        case "ListLoadedState": {
            const columns = mapColumns<T>(state.fields);

            return (
                <DataTable
                    columns={columns}
                    rows={state.items}
                    search={state.search}
                    onSearchChange={onSearchChange}
                />
            );
        }
    }
}

function mapColumns<T extends IdentifiableObject>(fields: ListField<T>[]): TableColumn<T>[] {
    return fields.map(field => {
        switch (field.type) {
            case "image": {
                const avatar = (row: T) => <Avatar src={(row[field.name] as unknown) as string} />;

                return {
                    name: field.name,
                    text: field.text,
                    getValue: avatar,
                };
            }
            case "url": {
                const link = (row: T) => <Link to={row[field.name]}>{row[field.name]}</Link>;

                return {
                    name: field.name,
                    text: field.text,
                    getValue: link,
                };
            }
            default: {
                return { name: field.name, text: field.text };
            }
        }
    });
}
