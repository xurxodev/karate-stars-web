import { Bloc } from "../../common/presentation/bloc";
import { FormState, FieldsDicctionary, FormFieldState } from "./FormState";
import UrlNotification, { NotificationErrors } from "../domain/Notification";

const initialFieldsState = {
    type: { name: "type", value: "news", options: ["news", "Competitors", "Videos"] },
    mode: { name: "mode", value: "Debug", options: ["Real", "Debug"] },
    url: { name: "url" },
    title: { name: "url" },
    description: { name: "url" }
};

class SendPushNotificationBloc extends Bloc<FormState>{

    constructor() {
        super({
            isValid: false,
            fields: initialFieldsState
        })
    }

    onFieldChanged(name: string, value: string) {
        debugger;
        const state = this.getState;

        const statePreviousToValidation = {
            ...state,
            fields: {
                ...state.fields,
                [name]: { ...state.fields[name], value }
            }
        };

        const result = UrlNotification.create({
            mode: statePreviousToValidation.fields[initialFieldsState.mode.name].value ?? "",
            title: statePreviousToValidation.fields[initialFieldsState.title.name].value ?? "",
            description: statePreviousToValidation.fields[initialFieldsState.description.name].value ?? "",
            url: statePreviousToValidation.fields[initialFieldsState.url.name].value ?? "",
        });

        const errors = result.isLeft ? result.value as NotificationErrors : {};

        const statePostToValidation = {
            ...state,
            fields: {
                ...state.fields,
                [name]: { ...state.fields[name], value, errors: errors ? errors[name] : undefined }
            }
        };

        const finalState = { ...statePostToValidation, isValid: this.isFormValid(statePostToValidation.fields) };

        this.changeState(finalState);
    }

    private isFormValid(fields: FieldsDicctionary): boolean {
        const isFieldValid = (field: FormFieldState): boolean => {
            return field.errors === undefined && field.value !== undefined && field.value.length > 0;
        };

        const existInvalidFields = Object.values(fields).map(field => isFieldValid(field)).includes(false);

        return !existInvalidFields;
    }

    submit() {

    }
}

export default SendPushNotificationBloc;