import { Credentials, ValidationErrorsDictionary, Either, ValidationErrorKey } from "karate-stars-core";
import LoginUseCase from "../domain/LoginUseCase";
import { GetUserError } from "../domain/Errors";
import FormBloc from "../../common/presentation/bloc/FormBloc";
import { FormState, FormSectionState } from "../../common/presentation/state/FormState";

class LoginBloc extends FormBloc {
    constructor(private loginUseCase: LoginUseCase) {
        super({
            isValid: false,
            sections: initialFieldsState,
            submitName: "Sign In",
            submitfullWidth: true,
        });
    }

    protected validateState(state: FormState): Record<string, ValidationErrorKey[]> | null {
        const result = this.createCredentials(state);
        const errors = result.fold(
            errors => errors,
            () => null
        );
        return errors;
    }

    private createCredentials(state: FormState): Either<ValidationErrorsDictionary, Credentials> {
        const loginFields = state.sections.flatMap(section =>
            section.fields.map(field => ({ [field.name]: field.value }))
        );

        const loginData = Object.assign({}, ...loginFields);

        return Credentials.create(loginData);
    }

    async submit() {
        debugger;
        if (this.state.isValid) {
            debugger;
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
            { label: "Email", name: "email", autoComplete: "username" },
            {
                label: "Password",
                name: "password",
                autoComplete: "current-password",
                type: "password",
            },
        ],
    },
];
