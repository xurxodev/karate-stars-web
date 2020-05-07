export interface FormFieldState {
    name: string;
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

export type LoginState = LoginFormState | LoginOkState;
