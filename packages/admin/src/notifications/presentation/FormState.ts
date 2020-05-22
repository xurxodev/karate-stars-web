export interface FormResultError {
    kind: "FormResultError";
    errors: string[];
}

export interface FormResultSuccess {
    kind: "FormResultSuccess";
    message: string;
}

export type FormResult = FormResultError | FormResultSuccess;

export interface SelectOption {
    id: string,
    name: string
}

export interface FormFieldState {
    name: string;
    errors?: string[];
    value?: string;
    selectOptions?: SelectOption[]
}

export type FieldsDicctionary = { [name: string]: FormFieldState }

export interface FormState {
    isValid: boolean;
    fields: FieldsDicctionary
    result?: FormResult;
}