import { FormState } from "./FormState";

export interface DetailLoadingState {
    kind: "DetailLoadingState";
}

export interface DetailFormUpdatedState {
    kind: "DetailFormUpdatedState";
    form: FormState;
}

export interface DetailErrorState {
    kind: "DetailErrorState";
    message: string;
}

export type DetailState = (DetailLoadingState | DetailFormUpdatedState | DetailErrorState) & {
    title: string;
};
