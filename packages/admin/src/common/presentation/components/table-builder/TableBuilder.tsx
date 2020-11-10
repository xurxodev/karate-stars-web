import React from "react";
import { Avatar, CircularProgress, makeStyles } from "@material-ui/core";
import { ListField, ListState } from "../../state/ListState";
import { Alert } from "@material-ui/lab";
import DataTable, { TableColumn, TablePagination, TableSorting } from "../data-table/DataTable";
import { Link, Redirect } from "react-router-dom";
import FabButton from "../add-fab-button/AddFabButton";

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
    onSortingChange?: (field: keyof T, order: "asc" | "desc") => void;
    onItemActionClick?: (actionName: string, id: string) => void;
    onItemClick?: (id: string) => void;
    onActionClick?: () => void;
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
    onSortingChange,
    onItemActionClick,
    onItemClick,
    onActionClick,
}: TableBuilderProps<T>): JSX.Element {
    const classes = useStyles();

    const handlePaginationChange = (pagination: TablePagination) => {
        if (onPaginationChange) {
            onPaginationChange(pagination.page, pagination.pageSize);
        }
    };

    const handleSortingChange = (sorting: TableSorting<T>) => {
        if (onSortingChange) {
            onSortingChange(sorting.field, sorting.order);
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
        case "NavigateTo": {
            return <Redirect to={state.route} />;
        }
        case "ListLoadedState": {
            const columns = mapColumns<T>(state.fields);

            return (
                <React.Fragment>
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
                        sorting={state.sorting}
                        actions={state.actions}
                        onSearchChange={onSearchChange}
                        onSelectionChange={onSelectionChange}
                        onSelectionAllChange={onSelectionAllChange}
                        onPaginationChange={handlePaginationChange}
                        onSortingChange={handleSortingChange}
                        onItemActionClick={onItemActionClick}
                        onRowClick={onItemClick}
                    />
                    {onActionClick && <FabButton action={onActionClick} />}
                </React.Fragment>
            );
        }
    }
}

function mapColumns<T extends IdentifiableObject>(fields: ListField<T>[]): TableColumn<T>[] {
    return fields.map(field => {
        const baseColumn = { name: field.name, text: field.text, sortable: field.sortable };

        switch (field.type) {
            case "image": {
                const avatar = (row: T) => <Avatar src={(row[field.name] as unknown) as string} />;

                return {
                    ...baseColumn,
                    getValue: avatar,
                };
            }
            case "url": {
                const link = (row: T) => <Link to={row[field.name]}>{row[field.name]}</Link>;

                return {
                    ...baseColumn,
                    getValue: link,
                };
            }
            default: {
                return baseColumn;
            }
        }
    });
}
