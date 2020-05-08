import Bloc from "../../common/presentation/bloc";
import { LoginState, LoginFormState, FormFieldState } from "./LoginState";
import { Email, EmailError } from "../domain/entities/Email";
import LoginUseCase from "../domain/LoginUseCase";
import { UserError } from "../domain/Errors";
import { Password } from "../domain/entities/Password";

class LoginBloc extends Bloc<LoginState>{

    constructor(private loginUseCase: LoginUseCase) {
        super({
            kind: "loginForm",
            isValid: false,
            email: { name: "email" },
            password: { name: "password" },
        })
    }

    changeEmail(emailInput: string) {
        const state = this.updateStateWithEmail(emailInput);

        this.changeState(state);
    }

    changePassword(passwordInput: string) {
        const state = this.updateStateWithPassword(passwordInput);

        this.changeState(state);
    }

    async login() {
        const formState = this.getState as LoginFormState

        if (formState.isValid) {
            const emailResult = Email.create(formState.email.value ?? "");
            const passwordResult = Password.create(formState.password.value ?? "");

            const result = await this.loginUseCase.execute(emailResult.value as Email, passwordResult.value as Password);

            result.fold(
                (error) => this.changeState(this.handleError(error)),
                (_) => this.changeState({ kind: "loginOk" }));
        } else {
            this.changeState(formState);
        }
    }

    private handleError(error: UserError): LoginState {
        const formState = this.getState as LoginFormState

        switch (error.kind) {
            case "ApiError": return { ...formState, error: `${error.error}: ${error.message}` };
            case "UnexpectedError": return { ...formState, error: `An unexpected error has ocurred: ${error.message}` };
        }
    }

    private updateStateWithEmail(emailInput: string): LoginState {
        const formState = this.getState as LoginFormState

        const handleError = (error: EmailError): string => {
            switch (error.kind) {
                case "InvalidEmail": return "Invalid email";
                case "InvalidEmptyEmail": return "Email is required";
            }
        }

        const email = Email.create(emailInput);

        const emailField = {
            ...formState.email,
            value: emailInput,
            error: email.fold((error) => handleError(error), () => undefined)
        }

        return {
            ...formState,
            isValid: this.isFormValid(emailField, formState.password),
            email: emailField
        };
    }

    private updateStateWithPassword(passwordInput: string): LoginState {
        const formState = this.getState as LoginFormState

        const password = Password.create(passwordInput);

        const passwordField = {
            ...formState.password,
            value: passwordInput,
            error: password.fold(() => "Password is required", () => undefined)
        };

        return {
            ...formState,
            isValid: this.isFormValid(formState.email, passwordField),
            password: passwordField
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