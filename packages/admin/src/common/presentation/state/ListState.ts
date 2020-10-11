export interface ListLoadingState {
    kind: "ListLoadingState";
}

export interface ListLoadedState<T> {
    kind: "ListLoadedState";
    items: Array<T>;
    fields: ListField<T>[];
}

export interface ListErrorState<T> {
    kind: "ListErrorState";
    message: string;
}

export interface ListField<T> {
    name: keyof T;
    text: string;
    type: "text" | "image" | "url";
}

export type ListState<T> = ListLoadingState | ListLoadedState<T> | ListErrorState<T>;
