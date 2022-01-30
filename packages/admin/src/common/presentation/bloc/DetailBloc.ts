import Bloc from "./Bloc";
import {
    FormChildrenState,
    formChildrenStatetoData,
    FormComplexFieldState,
    FormResult,
    FormSectionState,
    FormState,
    statetoData,
} from "../state/FormState";
import { validationErrorMessages, Either, ValidationErrorKey } from "karate-stars-core";
import { DataError } from "../../domain/Errors";
import { DetailPageState } from "../state/DetailPageState";
import { deleteAction, editAction } from "./basicActions";

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

    onFieldChanged(name: keyof TData, value: string | string[] | boolean) {
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

            this.validateFormAndChangeState(formStatePreviousToValidation, name);
        }
    }

    protected validateFormAndChangeState(form: FormState, name: keyof TData) {
        if (this.state.kind === "DetailFormUpdatedState") {
            const errors = this.validateFormState(form);

            const validatedForm = {
                ...form,
                sections: form.sections.map(section => {
                    return {
                        ...section,
                        fields: section.fields.map(field => {
                            const fieldErrors = errors?.find(
                                error => error.property === name
                            )?.errors;

                            return field.name === name
                                ? {
                                      ...field,
                                      errors: fieldErrors
                                          ? fieldErrors.map(error =>
                                                validationErrorMessages[error](name as string)
                                            )
                                          : undefined,
                                  }
                                : field;
                        }),
                    };
                }),
                isValid: !errors ? true : false,
            };

            this.changeState({ ...this.state, form: validatedForm });
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

    protected validateChildrenFormState(
        _field: keyof TData,
        _state: FormChildrenState
    ): ValidationBlocError[] | null {
        return null;
    }

    protected mapItemToFormChildrenState(
        field: keyof TData,
        childrenId?: string,
        item?: TData
    ): Promise<FormChildrenState> {
        return Promise.reject(
            new Error(
                "The method mapItemToFormChildrenState muest to be implemented in the derived class"
            )
        );
    }

    async onChildrenListItemActionClick(field: keyof TData, actionName: string, id: string) {
        if (this.state.kind === "DetailFormUpdatedState") {
            const complexField = this.getComplexField(field);

            switch (actionName) {
                case editAction.name: {
                    this.updateChildrenForm(
                        field,
                        await this.mapItemToFormChildrenState(
                            field,
                            id,
                            statetoData(this.state.form)
                        )
                    );
                    break;
                }
                case deleteAction.name: {
                    const items = complexField?.list.items.filter(item => item.id !== id) || [];

                    this.updateChildrenList(field, items);

                    this.validateFormAndChangeState(this.state.form, field);

                    break;
                }
            }
        }
    }

    onChildrenActionClick = async (field: keyof TData) => {
        this.updateChildrenForm(field, await this.mapItemToFormChildrenState(field));
    };

    onChildrenFieldChange = (
        field: keyof TData,
        name: string,
        value: string | string[] | boolean
    ) => {
        const complexField = this.getComplexField(field);

        if (complexField && complexField.form) {
            const updatedForm = {
                ...complexField.form,
                fields: complexField.form.fields.map(field => {
                    return field.name === name ? { ...field, value } : field;
                }),
            };

            const errors = this.validateChildrenFormState(field, updatedForm);

            const validatedForm = {
                ...complexField.form,
                fields: complexField.form.fields.map(field => {
                    const fieldErrors = errors?.find(error => error.property === name)?.errors;

                    return field.name === name
                        ? {
                              ...field,
                              errors: fieldErrors
                                  ? fieldErrors.map(error => validationErrorMessages[error](name))
                                  : undefined,
                              value,
                          }
                        : field;
                }),
                isValid: !errors ? true : false,
            };

            this.updateChildrenForm(field, validatedForm);
        }
    };

    onChildrenFormSave = async (field: keyof TData) => {
        if (this.state.kind === "DetailFormUpdatedState") {
            const complexField = this.getComplexField(field);

            if (complexField && complexField.form) {
                const newItem: any = formChildrenStatetoData(complexField?.form);

                const exists = complexField.list.items.some(item => item.id === newItem.id);

                if (exists) {
                    const items = complexField.list.items.map(item => {
                        return item.id === newItem.id ? newItem : item;
                    });

                    this.updateChildrenList(field, items);
                } else {
                    const items = [...complexField.list.items, newItem];

                    this.updateChildrenList(field, items);
                }
            }

            this.updateChildrenForm(field, undefined);

            this.changeState({
                ...this.state,
                form: {
                    ...this.state.form,
                    sections: await this.mapItemToFormSectionsState(statetoData(this.state.form)),
                },
            });

            this.validateFormAndChangeState(this.state.form, field);
        }
    };

    onChildrenFormCancel = (formField: keyof TData) => {
        this.updateChildrenForm(formField, undefined);
    };

    private updateChildrenForm(formField: keyof TData, childrenForm?: FormChildrenState) {
        if (this.state.kind === "DetailFormUpdatedState") {
            this.changeState({
                ...this.state,
                form: {
                    ...this.state.form,
                    sections: this.state.form.sections.map(section => ({
                        ...section,
                        fields: section.fields.map(field => {
                            if (
                                field.kind === "FormComplexFieldState" &&
                                field.name === formField
                            ) {
                                return {
                                    ...field,
                                    form: childrenForm,
                                };
                            } else {
                                return field;
                            }
                        }),
                    })),
                },
            });
        }
    }

    private updateChildrenList(formField: keyof TData, items: any[]) {
        if (this.state.kind === "DetailFormUpdatedState") {
            this.changeState({
                ...this.state,
                form: {
                    ...this.state.form,
                    sections: this.state.form.sections.map(section => ({
                        ...section,
                        fields: section.fields.map(field => {
                            if (
                                field.kind === "FormComplexFieldState" &&
                                field.name === formField
                            ) {
                                return {
                                    ...field,
                                    list: {
                                        ...field.list,
                                        items,
                                    },
                                };
                            } else {
                                return field;
                            }
                        }),
                    })),
                },
            });
        }
    }

    private getComplexField(fieldName: keyof TData): FormComplexFieldState | undefined {
        if (this.state.kind === "DetailFormUpdatedState") {
            const allfields = this.state.form.sections
                .flatMap(section => section.fields)
                .filter(field => field.kind === "FormComplexFieldState");
            return allfields.find(field => field.name === fieldName) as FormComplexFieldState;
        } else {
            return undefined;
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
