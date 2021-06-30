import Bloc from "./Bloc";
import { FormResult, FormSectionState, FormState, statetoData } from "../state/FormState";
import { validationErrorMessages, Either, ValidationErrorKey } from "karate-stars-core";
import { DataError } from "../../domain/Errors";
import { DetailPageState } from "../state/DetailPageState";

export declare type ValidationBlocError = {
    type: string;
    property: string;
    value: unknown;
    errors: ValidationErrorKey[];
};

export default abstract class DetailBloc<TData> extends Bloc<DetailPageState> {
    protected abstract validateFormState(state: FormState): ValidationBlocError[] | null;
    protected abstract getItem(id: string): Promise<Either<DataError, TData>>;
    protected abstract mapItemToFormSectionsState(item?: TData): Promise<FormSectionState[]>;
    protected abstract saveItem(item?: TData): Promise<Either<DataError, true>>;

    constructor(private title: string) {
        super({ kind: "DetailLoadingState", title });
    }

    async init(id?: string) {
        const formUpdated: DetailPageState = {
            kind: "DetailFormUpdatedState",
            title: this.title,
            form: {
                submitName: "Accept",
                isValid: false,
                showCancel: true,
                sections: await this.mapItemToFormSectionsState(),
            },
        };

        if (id) {
            const getItemResult = await this.getItem(id);

            getItemResult.fold(
                error => this.changeState(this.handleInitError(error)),
                async data => {
                    this.changeState({
                        ...formUpdated,
                        form: {
                            ...formUpdated.form,
                            sections: await this.mapItemToFormSectionsState(data),
                        },
                    });
                }
            );
        } else {
            this.changeState(formUpdated);
        }
    }

    onFieldChanged(name: string, value: string | string[]) {
        if (this.state.kind === "DetailFormUpdatedState") {
            const formState = this.state.form;
            const formStatePreviousToValidation = {
                ...formState,
                sections: formState.sections.map(section => {
                    return {
                        ...section,
                        fields: section.fields.map(field =>
                            field.name === name ? { ...field, value: value } : field
                        ),
                    };
                }),
            };

            const errors = this.validateFormState(formStatePreviousToValidation);

            const statePostToValidation = {
                ...formStatePreviousToValidation,
                sections: formStatePreviousToValidation.sections.map(section => {
                    return {
                        ...section,
                        fields: section.fields.map(field => {
                            const fieldErrors = errors?.find(error => error.property === name)
                                ?.errors;

                            return field.name === name
                                ? {
                                      ...field,
                                      errors: fieldErrors
                                          ? fieldErrors.map(error =>
                                                validationErrorMessages[error](name)
                                            )
                                          : undefined,
                                  }
                                : field;
                        }),
                    };
                }),
                isValid: !errors ? true : false,
            };

            this.changeState({ ...this.state, form: statePostToValidation });
        }
    }

    async submit() {
        if (this.state.kind === "DetailFormUpdatedState" && this.state.form.isValid) {
            const state = this.state;
            const sendResult = await this.saveItem(statetoData(this.state.form));

            sendResult.fold(
                (error: DataError) =>
                    this.changeState({
                        ...state,
                        form: { ...state.form, result: this.handleSubmitError(error) },
                    }),
                () =>
                    this.changeState({
                        ...state,
                        form: {
                            ...state.form,
                            result: {
                                kind: "FormResultSuccess",
                                message: `${state.title} saved!`,
                            },
                        },
                    })
            );
        } else {
            this.changeState({ ...this.state });
        }
    }

    private handleInitError(error: DataError): DetailPageState {
        switch (error.kind) {
            case "Unauthorized":
                return {
                    kind: "DetailErrorState",
                    title: this.title,
                    message: "Invalid credentials",
                };
            case "ApiError":
                return {
                    kind: "DetailErrorState",
                    title: this.title,
                    message: `Sorry, an error has ocurred in the server. Please try later again`,
                };
            case "UnexpectedError":
                return {
                    kind: "DetailErrorState",
                    title: this.title,
                    message: `Sorry, an error has ocurred. Please try later again`,
                };
        }
    }

    private handleSubmitError(error: DataError): FormResult {
        switch (error.kind) {
            case "Unauthorized":
                return { kind: "FormResultError", message: "Invalid credentials" };

            case "ApiError":
                return {
                    kind: "FormResultError",
                    message: `Sorry, an error has ocurred in the server. Please try later again`,
                };
            case "UnexpectedError":
                return {
                    kind: "FormResultError",
                    message: `Sorry, an error has ocurred. Please try later again`,
                };
        }
    }
}
