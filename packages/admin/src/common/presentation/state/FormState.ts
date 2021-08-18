import { ListState } from "./ListState";

export interface FormResultError {
    kind: "FormResultError";
    message: string;
}

export interface FormResultSuccess {
    kind: "FormResultSuccess";
    message: string;
}

export type GridSize = "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type FormResult = FormResultError | FormResultSuccess;

export interface SelectOption {
    id: string;
    name: string;
}

export type ImageType = "image" | "avatar";

export interface FormComplexFieldState {
    kind: "FormComplexFieldState";
    name: string;
    required?: boolean;
    xs?: GridSize;
    sm?: GridSize;
    md?: GridSize;
    lg?: GridSize;
    xl?: GridSize;
    hide?: boolean;
    list: ListState<any>;
    listLabel: string;
    formLabel: string;
    form?: FormChildrenState;
}

export interface FormSingleFieldState {
    kind: "FormSingleFieldState";
    label: string;
    name: string;
    alt?: string;
    errors?: string[];
    value?: string | string[] | boolean;
    selectOptions?: SelectOption[];
    multiple?: boolean;
    required?: boolean;
    xs?: GridSize;
    sm?: GridSize;
    md?: GridSize;
    lg?: GridSize;
    xl?: GridSize;
    autoComplete?: string;
    type?: string;
    imageType?: ImageType;
    accept?: string;
    hide?: boolean;
    maxLength?: number;
    multiline?: boolean;
    checked?: boolean;
}

export type FormFieldState = FormComplexFieldState | FormSingleFieldState;

export interface FormSectionState {
    title?: string;
    xs?: GridSize;
    sm?: GridSize;
    md?: GridSize;
    lg?: GridSize;
    xl?: GridSize;
    fields: FormFieldState[];
}

export interface FormState {
    isValid: boolean;
    sections: FormSectionState[];
    result?: FormResult;
    submitName?: string;
    submitfullWidth?: boolean;
    showCancel?: boolean;
    cancelName?: string;
}

export interface FormChildrenState {
    title: string;
    fields: FormSingleFieldState[];
}

export function statetoData<T>(state: FormState): T {
    const fields = state.sections.flatMap(section =>
        section.fields.map(field => {
            if (field.kind === "FormSingleFieldState") {
                return { [field.name]: field.value };
            } else {
                return { [field.name]: field.list.items };
            }
        })
    );

    return Object.assign({}, ...fields);
}

export function formChildrenStatetoData<T>(state: FormChildrenState): T {
    const fields = state.fields.map(field => {
        return { [field.name]: field.value };
    });

    return Object.assign({}, ...fields);
}
