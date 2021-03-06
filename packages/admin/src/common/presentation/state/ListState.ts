export interface ListLoadingState {
    kind: "ListLoadingState";
}

export interface ListLoadedState<T extends IdentifiableObject> {
    kind: "ListLoadedState";
    items: Array<T>;
    fields: ListField<T>[];
    search?: string;
    selectedItems: string[];
    pagination: ListPagination;
    sorting?: ListSorting<T>;
    actions?: ListAction[];
    itemsToDelete?: string[];
}

export interface ListErrorState {
    kind: "ListErrorState";
    message: string;
}

export interface NavigateTo {
    kind: "NavigateTo";
    route: string;
}

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
    type: "text" | "image" | "url";
}

export interface ListPagination {
    pageSizeOptions: number[];
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

export type ListState<T extends IdentifiableObject> =
    | ListLoadingState
    | ListLoadedState<T>
    | ListErrorState
    | NavigateTo;
