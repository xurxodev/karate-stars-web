import Bloc from "./Bloc";
import { FormState } from "../state/FormState";
import { validationErrorMessages, ValidationErrorKey } from "karate-stars-core";

export default abstract class FormBloc extends Bloc<FormState> {
    protected abstract validateState(state: FormState): Record<string, ValidationErrorKey[]> | null;

    onFieldChanged(name: string, value: string) {
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
                        const fieldErrors = errors ? errors[name] : undefined;

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
