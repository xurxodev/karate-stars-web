import { Credentials, Either, ValidationError } from "karate-stars-core";
import LoginUseCase from "../domain/LoginUseCase";
import { GetUserError } from "../domain/Errors";
import FormBloc from "../../common/presentation/bloc/FormBloc";
import {
    FormState,
    FormSectionState,
    statetoData,
} from "../../common/presentation/state/FormState";

class LoginBloc extends FormBloc<Credentials> {
    constructor(private loginUseCase: LoginUseCase) {
        super({
            isValid: false,
            sections: initialFieldsState,
            submitName: "Sign In",
            submitfullWidth: true,
        });
    }

    protected validateState(state: FormState): ValidationError<Credentials>[] | null {
        const result = this.createCredentials(state);
        const errors = result.fold(
            errors => errors,
            () => null
        );
        return errors;
    }

    private createCredentials(
        state: FormState
    ): Either<ValidationError<Credentials>[], Credentials> {
        return Credentials.create(statetoData(state));
    }

    async submit() {
        if (this.state.isValid) {
            const credentials = this.createCredentials(this.state).getOrThrow();

            const loginResult = await this.loginUseCase.execute(credentials);

            loginResult.fold(
                (error: GetUserError) => this.changeState(this.handleError(error)),
                () =>
                    this.changeState({
                        ...this.state,
                        result: {
                            kind: "FormResultSuccess",
                            message: "Sign In successfully",
                        },
                    })
            );
        } else {
            this.changeState(this.state);
        }
    }

    private handleError(error: GetUserError): FormState {
        switch (error.kind) {
            case "Unauthorized": {
                return {
                    ...this.state,
                    result: { kind: "FormResultError", message: "Invalid credentials" },
                };
            }
            case "ApiError": {
                return {
                    ...this.state,
                    result: {
                        kind: "FormResultError",
                        message:
                            "Sorry, an error has ocurred in the server. Please try later again",
                    },
                };
            }
            case "UnexpectedError": {
                return {
                    ...this.state,
                    result: {
                        kind: "FormResultError",
                        message: "Sorry, an error has ocurred. Please try later again",
                    },
                };
            }
        }
    }
}

export default LoginBloc;

const initialFieldsState: FormSectionState[] = [
    {
        fields: [
            {
                kind: "FormSingleFieldState",
                label: "Email",
                name: "email",
                autoComplete: "username",
            },
            {
                kind: "FormSingleFieldState",
                label: "Password",
                name: "password",
                autoComplete: "current-password",
                type: "password",
            },
        ],
    },
];
