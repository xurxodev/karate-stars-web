export interface FormFieldState {
    name: string;
    touched?: boolean;
    error?: string;
    value?: string;
}

export interface LoginFormState {
    kind: "loginForm";
    isValid: boolean;
    email: FormFieldState;
    password: FormFieldState;
    error?: string;
}

export interface LoginOkState {
    kind: "loginOk";
}

export interface LoginNoOkState {
    kind: "loginNoOk";
}

export type LoginState = LoginFormState | LoginOkState | LoginNoOkState;
