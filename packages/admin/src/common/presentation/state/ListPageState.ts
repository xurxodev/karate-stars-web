import { IdentifiableObject, ListState } from "./ListState";

export interface ListLoadingState {
    kind: "ListLoadingState";
}

export interface ListLoadedState<T extends IdentifiableObject> extends ListState<T> {
    kind: "ListLoadedState";
}

export interface ListErrorState {
    kind: "ListErrorState";
    message: string;
}

export interface NavigateTo {
    kind: "NavigateTo";
    route: string;
}

export type ListPageState<T extends IdentifiableObject> =
    | ListLoadingState
    | ListLoadedState<T>
    | ListErrorState
    | NavigateTo;
