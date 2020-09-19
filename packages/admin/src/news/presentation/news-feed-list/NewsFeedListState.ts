export interface ListLoadingState {
    kind: "ListLoadingState";
}

export interface ListLoadedState<T> {
    kind: "ListLoadedState";
    data: T;
}

export interface ListErrorState<T> {
    kind: "ListErrorState";
    message: string;
}

export type ListState<T> = ListLoadingState | ListLoadedState<T> | ListErrorState<T>;
