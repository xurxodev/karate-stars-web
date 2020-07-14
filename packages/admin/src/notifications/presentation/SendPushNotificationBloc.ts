import { Bloc } from "../../common/presentation/bloc";
import { FormState, FormFieldState } from "./FormState";
import {
    NotificationErrors,
    URL_NEWS_TOPIC,
    DEBUG_URL_NEWS_TOPIC,
} from "../domain/entities/PushNotification";
import { UrlNotification } from "../domain/entities/UrlNotification";
import SendPushNotificationUseCase from "../domain/SendPushNotificationUseCase";
import { SendPushNotificationError } from "../domain/Errors";
import { Either } from "karate-stars-core";

const initialFieldsState: FormFieldState[] = [
    {
        label: "Type",
        name: "type",
        value: "news",
        selectOptions: [
            { id: "news", name: "News" },
            { id: "competitors", name: "Competitors" },
            { id: "videos", name: "Videos" },
        ],
        md: 4,
        xs: 12,
    },
    {
        label: "Topic",
        name: "topic",
        value: DEBUG_URL_NEWS_TOPIC,
        selectOptions: [
            { id: DEBUG_URL_NEWS_TOPIC, name: "Debug" },
            { id: URL_NEWS_TOPIC, name: "Real" },
        ],
        md: 4,
        xs: 12,
    },
    { label: "Url", name: "url", xs: 12 },
    { label: "Title", name: "title", xs: 12 },
    { label: "Description", name: "description", xs: 12 },
];

class SendPushNotificationBloc extends Bloc<FormState> {
    constructor(private sendPushNotificationUseCase: SendPushNotificationUseCase) {
        super({
            title: "Send push notification",
            isValid: false,
            fields: initialFieldsState,
        });
    }

    onFieldChanged(name: string, value: string) {
        const state = this.getState;

        const statePreviousToValidation = {
            ...state,
            fields: state.fields.map(field => {
                const newfield = field.name === name ? { ...field, value: value } : field;

                return newfield;
            }),
        };

        const result = this.createNotification(statePreviousToValidation);

        const errors = result.fold(
            errors => errors,
            () => ({})
        );

        const statePostToValidation = {
            ...statePreviousToValidation,
            fields: statePreviousToValidation.fields.map(field =>
                field.name === name
                    ? { ...field, errors: errors ? errors[name] : undefined }
                    : field
            ),
        };

        const finalState = {
            ...statePostToValidation,
            isValid: this.isFormValid(statePostToValidation.fields),
        };

        this.changeState(finalState);
    }

    async submit() {
        if (this.getState.isValid) {
            const creationResult = this.createNotification(this.getState);

            const sendResult = await this.sendPushNotificationUseCase.execute(
                creationResult.getOrThrow()
            );

            sendResult.fold(
                (error: SendPushNotificationError) => this.changeState(this.handleError(error)),
                () =>
                    this.changeState({
                        ...this.getState,
                        result: {
                            kind: "FormResultSuccess",
                            message: "Push notification sent successfully",
                        },
                    })
            );
        } else {
            this.changeState({ ...this.getState });
        }
    }

    private handleError(error: SendPushNotificationError): FormState {
        switch (error.kind) {
            case "Unauthorized":
                return {
                    ...this.getState,
                    result: { kind: "FormResultError", message: "Invalid credentials" },
                };
            case "ApiError":
                return {
                    ...this.getState,
                    result: {
                        kind: "FormResultError",
                        message: `${error.error}: ${error.message}`,
                    },
                };
            case "UnexpectedError":
                return {
                    ...this.getState,
                    result: {
                        kind: "FormResultError",
                        message: `An unexpected error has ocurred: ${error.message}`,
                    },
                };
        }
    }

    private createNotification(state: FormState): Either<NotificationErrors, UrlNotification> {
        const notificationDataFields = state.fields.map(field => ({ [field.name]: field.value }));
        const notificationData = Object.assign({}, ...notificationDataFields);

        return UrlNotification.create(notificationData);
    }

    private isFormValid(fields: FormFieldState[]): boolean {
        const isFieldValid = (field: FormFieldState): boolean => {
            return (
                field.errors === undefined && field.value !== undefined && field.value.length > 0
            );
        };

        const existInvalidFields = Object.values(fields)
            .map(field => isFieldValid(field))
            .includes(false);

        return !existInvalidFields;
    }
}

export default SendPushNotificationBloc;
