import React from "react";
import { Avatar } from "@material-ui/core";
import DataTable, { TableColumn, TablePager, TableSorting } from "../data-table/DataTable";
import FabButton from "../add-fab-button/AddFabButton";
import ConfirmationDialog from "../confirmation-dialog/ConfirmationDialog";
import { ListField, ListState } from "../../state/ListState";
import { ClassNameMap } from "@material-ui/styles";

interface TableBuilderProps<T extends IdentifiableObject> {
    className?: string;
    classes?: Partial<ClassNameMap<"fab">>;
    state: ListState<T>;
    onSearchChange?: (search: string) => void;
    onSelectionChange?: (id: string) => void;
    onSelectionAllChange?: (select: boolean) => void;
    onPaginationChange?: (page: number, pageSize: number) => void;
    onSortingChange?: (field: keyof T, order: "asc" | "desc") => void;
    onItemActionClick?: (actionName: string, id: string) => void;
    onItemClick?: (id: string) => void;
    onActionClick?: () => void;
    onConfirmDelete?: () => void;
    onCancelDelete?: () => void;
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
    onConfirmDelete,
    onCancelDelete,
    classes,
}: TableBuilderProps<T>): JSX.Element {
    const handlePaginationChange = (pagination: TablePager) => {
        if (onPaginationChange) {
            onPaginationChange(pagination.page, pagination.pageSize);
        }
    };

    const handleSortingChange = (sorting: TableSorting<T>) => {
        if (onSortingChange) {
            onSortingChange(sorting.field, sorting.order);
        }
    };

    const columns = mapColumns<T>(state.fields);

    return (
        <React.Fragment>
            {onActionClick && <FabButton action={onActionClick} className={classes?.fab} />}
            <DataTable
                columns={columns}
                rows={state.items}
                search={state.search}
                searchEnable={state.searchEnable}
                selectedRows={state.selectedItems}
                paginationOptions={state.pagination?.pageSizeOptions}
                pagination={
                    state.pagination
                        ? {
                              pageSize: state.pagination.pageSize,
                              page: state.pagination.page,
                              total: state.pagination.total,
                          }
                        : undefined
                }
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

            {state.itemsToDelete && (
                <ConfirmationDialog
                    open={true}
                    title={"Delete confirmation"}
                    description={`Are you sure you want to delete ${state.itemsToDelete.length} items`}
                    onSave={onConfirmDelete}
                    onCancel={onCancelDelete}
                />
            )}
        </React.Fragment>
    );
}

function mapColumns<T extends IdentifiableObject>(fields: ListField<T>[]): TableColumn<T>[] {
    return fields.map(field => {
        const baseColumn = { name: field.name, text: field.text, sortable: field.sortable };

        switch (field.type) {
            case "smallImage":
            case "image": {
                const image = (row: T) => (
                    <img
                        width={field.type === "image" ? "150" : "60"}
                        style={{ borderRadius: "5%" }}
                        src={(row[field.name] as unknown) as string}
                        alt={field.alt ? ((row[field.alt] as unknown) as string) : undefined}
                    />
                );

                return {
                    ...baseColumn,
                    getValue: image,
                };
            }
            case "avatar": {
                const avatar = (row: T) => (
                    <Avatar
                        src={(row[field.name] as unknown) as string}
                        alt={field.alt ? ((row[field.alt] as unknown) as string) : undefined}
                    />
                );

                return {
                    ...baseColumn,
                    getValue: avatar,
                };
            }
            case "url": {
                const link = (row: T) => {
                    const url = (row[field.name] as unknown) as string;
                    return (
                        <a href={url} target="_blank" rel="noreferrer noopener">
                            {url}
                        </a>
                    );
                };

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
