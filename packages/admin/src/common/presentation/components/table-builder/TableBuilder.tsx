import React from "react";
import { Avatar, CircularProgress, makeStyles } from "@material-ui/core";
import { ListField, ListState } from "../../state/ListState";
import { Alert } from "@material-ui/lab";
import DataTable, { TableColumn, TablePagination } from "../data-table/DataTable";
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
    onSearchChange?: (search: string) => void;
    onSelectionChange?: (id: string) => void;
    onSelectionAllChange?: (select: boolean) => void;
    onPaginationChange?: (page: number, pageSize: number) => void;
}

interface IdentifiableObject {
    id: string;
}

export default function TableBuilder<T extends IdentifiableObject>({
    state,
    onSearchChange,
    onSelectionChange,
    onSelectionAllChange,
    onPaginationChange,
}: TableBuilderProps<T>) {
    const classes = useStyles();

    const handlePaginationChange = (pagination: TablePagination) => {
        if (onPaginationChange) {
            onPaginationChange(pagination.page, pagination.pageSize);
        }
    };

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
                    selectedRows={state.selectedItems}
                    paginationOptions={state.pagination.pageSizeOptions}
                    pagination={{
                        pageSize: state.pagination.pageSize,
                        page: state.pagination.page,
                        total: state.pagination.total,
                    }}
                    onSearchChange={onSearchChange}
                    onSelectionChange={onSelectionChange}
                    onSelectionAllChange={onSelectionAllChange}
                    onPaginationChange={handlePaginationChange}
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
