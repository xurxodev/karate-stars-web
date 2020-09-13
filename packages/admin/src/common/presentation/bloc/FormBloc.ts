import Bloc from "./Bloc";
import { FormState } from "../state/FormState";

export default abstract class FormBloc extends Bloc<FormState> {
    protected abstract validateState(state: FormState): Record<string, string[]> | null;

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
                    fields: section.fields.map(field =>
                        field.name === name
                            ? { ...field, errors: errors ? errors[name] : undefined }
                            : field
                    ),
                };
            }),
            isValid: !errors ? true : false,
        };

        this.changeState(statePostToValidation);
    }
}
