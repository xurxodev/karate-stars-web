import Bloc from "./Bloc";
import { FormState } from "../state/FormState";
import { validationErrorMessages, ValidationError } from "karate-stars-core";

export default abstract class FormBloc<T> extends Bloc<FormState> {
    protected abstract validateState(state: FormState): ValidationError<T>[] | null;

    onFieldChanged(name: string, value: string | string[] | boolean) {
        const statePreviousToValidation = {
            ...this.state,
            sections: this.state.sections.map(section => {
                return {
                    ...section,
                    fields: section.fields.map(field =>
                        field.name === name ? { ...field, value: value } : field
                    ),
                };
            }),
        };

        const errors = this.validateState(statePreviousToValidation);

        const statePostToValidation = {
            ...statePreviousToValidation,
            sections: statePreviousToValidation.sections.map(section => {
                return {
                    ...section,
                    fields: section.fields.map(field => {
                        const fieldErrors = errors?.find(error => error.property === name)?.errors;

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

        this.changeState(statePostToValidation);
    }
}
