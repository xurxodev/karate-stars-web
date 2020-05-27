export interface FormResultError {
    kind: "FormResultError";
    message: string;
}

export interface FormResultSuccess {
    kind: "FormResultSuccess";
    message: string;
}

export type GridSize = 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type FormResult = FormResultError | FormResultSuccess;

export interface SelectOption {
    id: string,
    name: string
}

export interface FormFieldState {
    label: string
    name: string;
    errors?: string[];
    value?: string;
    selectOptions?: SelectOption[];
    xs?: GridSize;
    sm?: GridSize;
    md?: GridSize;
    lg?: GridSize;
    xl?: GridSize;
}

export interface FormState {
    title: string;
    isValid: boolean;
    fields: FormFieldState[]
    result?: FormResult;
}