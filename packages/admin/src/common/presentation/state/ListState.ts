export type ListState<T extends IdentifiableObject> = {
    items: Array<T>;
    fields: ListField<T>[];
    search?: string;
    searchEnable?: boolean;
    selectedItems: string[];
    pagination?: ListPagination;
    sorting?: ListSorting<T>;
    actions?: ListAction[];
    itemsToDelete?: string[];
};

export type SortDirection = "asc" | "desc";

export interface ListSorting<T extends IdentifiableObject> {
    field: keyof T;
    order: SortDirection;
}

export interface ListAction {
    name: string;
    text: string;
    icon?: string;
    multiple?: boolean;
    primary?: boolean;
    active?: boolean;
}

export interface ListField<T> {
    name: keyof T;
    alt?: keyof T;
    text: string;
    sortable?: boolean;
    searchable?: boolean;
    type: "text" | "image" | "smallImage" | "avatar" | "url" | "boolean";
    hide?: boolean;
}

export interface ListPagination {
    pageSizeOptions?: number[];
    pageSize: number;
    total: number;
    page: number;
}

export interface ListSorting<T extends IdentifiableObject> {
    field: keyof T;
    order: "asc" | "desc";
}

export interface IdentifiableObject {
    id: string;
}
