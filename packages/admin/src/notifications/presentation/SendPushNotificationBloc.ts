import { Bloc } from "../../common/presentation/bloc";
import { FormState, FieldsDicctionary, FormFieldState } from "./FormState";
import UrlNotification, { NotificationErrors } from "../domain/Notification";
import { Either } from "../../common/domain/Either";

const initialFieldsState = {
    type: {
        name: "type", value: "news",
        selectOptions: [
            { id: "news", name: "News" },
            { id: "competitors", name: "Competitors" },
            { id: "videos", name: "Videos" }]
    },
    mode: {
        name: "mode", value: "debug",
        selectOptions: [
            { id: "real", name: "Real" },
            { id: "debug", name: "Debug" }]
    },
    url: { name: "url" },
    title: { name: "title" },
    description: { name: "description" }
};

class SendPushNotificationBloc extends Bloc<FormState>{

    constructor() {
        super({
            isValid: false,
            fields: initialFieldsState
        })
    }

    onFieldChanged(name: string, value: string) {
        const state = this.getState;

        const statePreviousToValidation = {
            ...state,
            fields: {
                ...state.fields,
                [name]: { ...state.fields[name], value }
            }
        };

        const result = this.createNotification(statePreviousToValidation);

        const errors = result.isLeft() ? result.value as NotificationErrors : {};

        debugger;
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

    submit() {
        const result = this.createNotification(this.getState);

        const state = JSON.stringify(this.getState);

        this.changeState({ ...this.getState, result: { kind: "FormResultSuccess", message: state } })
    }

    private createNotification(state: FormState): Either<NotificationErrors, UrlNotification> {
        return UrlNotification.create({
            mode: state.fields[initialFieldsState.mode.name].value ?? "",
            title: state.fields[initialFieldsState.title.name].value ?? "",
            description: state.fields[initialFieldsState.description.name].value ?? "",
            url: state.fields[initialFieldsState.url.name].value ?? "",
        });
    }

    private isFormValid(fields: FieldsDicctionary): boolean {
        const isFieldValid = (field: FormFieldState): boolean => {
            return field.errors === undefined && field.value !== undefined && field.value.length > 0;
        };

        const existInvalidFields = Object.values(fields).map(field => isFieldValid(field)).includes(false);

        return !existInvalidFields;
    }
}

export default SendPushNotificationBloc;