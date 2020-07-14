import { Bloc } from "../../common/presentation/bloc";
import { LoginState, LoginFormState, FormFieldState } from "./LoginState";
import { Email, EmailError, Password, PasswordError } from "karate-stars-core";
import LoginUseCase from "../domain/LoginUseCase";
import { GetUserError } from "../domain/Errors";

class LoginBloc extends Bloc<LoginState> {
    constructor(private loginUseCase: LoginUseCase) {
        super({
            kind: "loginForm",
            isValid: false,
            email: { name: "email" },
            password: { name: "password" },
        });
    }

    changeEmail(emailInput: string): void {
        const state = this.updateStateWithEmail(emailInput);

        this.changeState(state);
    }

    changePassword(passwordInput: string): void {
        const state = this.updateStateWithPassword(passwordInput);

        this.changeState(state);
    }

    async login() {
        const formState = this.getState as LoginFormState;

        if (formState.isValid) {
            const email = Email.create(formState.email.value ?? "").getOrThrow();
            const password = Password.create(formState.password.value ?? "").getOrThrow();

            const result = await this.loginUseCase.execute(email, password);

            result.fold(
                error => this.changeState(this.handleError(error)),
                _ => this.changeState({ kind: "loginOk" })
            );
        } else {
            this.changeState(formState);
        }
    }

    private handleError(error: GetUserError): LoginState {
        const formState = this.getState as LoginFormState;

        switch (error.kind) {
            case "Unauthorized":
                return { ...formState, error: `Invalid credentials` };
            case "ApiError":
                return { ...formState, error: `${error.error}: ${error.message}` };
            case "UnexpectedError":
                return { ...formState, error: `An unexpected error has ocurred: ${error.message}` };
        }
    }

    private updateStateWithEmail(emailInput: string): LoginState {
        const formState = this.getState as LoginFormState;

        const handleError = (error: EmailError): string => {
            switch (error.kind) {
                case "InvalidEmail":
                    return "Invalid email";
                case "InvalidEmptyEmail":
                    return "Email is required";
            }
        };

        const email = Email.create(emailInput);

        const emailField = {
            ...formState.email,
            value: emailInput,
            error: email.fold(
                error => handleError(error),
                () => undefined
            ),
        };

        return {
            ...formState,
            isValid: this.isFormValid(emailField, formState.password),
            email: emailField,
        };
    }

    private updateStateWithPassword(passwordInput: string): LoginState {
        const formState = this.getState as LoginFormState;

        const handleError = (error: PasswordError): string => {
            switch (error.kind) {
                case "InvalidEmptyPassword":
                    return "Email is required";
            }
        };

        const password = Password.create(passwordInput);

        const passwordField = {
            ...formState.password,
            value: passwordInput,
            error: password.fold(
                error => handleError(error),
                () => undefined
            ),
        };

        return {
            ...formState,
            isValid: this.isFormValid(formState.email, passwordField),
            password: passwordField,
        };
    }

    private isFormValid(email: FormFieldState, password: FormFieldState): boolean {
        const isFieldValid = (field: FormFieldState): boolean => {
            return field.error === undefined && field.value !== undefined && field.value.length > 0;
        };

        return isFieldValid(email) && isFieldValid(password);
    }
}

export default LoginBloc;
