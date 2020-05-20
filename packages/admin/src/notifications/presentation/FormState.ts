export interface FormResultError {
    kind: "FormResultError";
    errors: string[];
}

export interface FormResultSuccess {
    kind: "FormResultSuccess";
}

export type FormResult = FormResultError | FormResultSuccess;

export interface FormFieldState {
    name: string;
    errors?: string[];
    value?: string;
    options?: string[]
}

export type FieldsDicctionary = { [name: string]: FormFieldState }

export interface FormState {
    isValid: boolean;
    fields: FieldsDicctionary
    result?: FormResult;
}