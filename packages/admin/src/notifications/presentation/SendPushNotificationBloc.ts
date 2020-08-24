import { FormState, FormFieldState } from "../../common/presentation/state/FormState";
import {
    NotificationErrors,
    URL_NEWS_TOPIC,
    DEBUG_URL_NEWS_TOPIC,
} from "../domain/entities/PushNotification";
import { UrlNotification } from "../domain/entities/UrlNotification";
import SendPushNotificationUseCase from "../domain/SendPushNotificationUseCase";
import { SendPushNotificationError } from "../domain/Errors";
import { Either } from "karate-stars-core";
import FormBloc from "../../common/presentation/bloc/FormBloc";

class SendPushNotificationBloc extends FormBloc {
    constructor(private sendPushNotificationUseCase: SendPushNotificationUseCase) {
        super({
            title: "Send push notification",
            isValid: false,
            fields: initialFieldsState,
        });
    }

    protected validateState(state: FormState): Record<string, string[]> | null {
        const result = this.createNotification(state);
        const errors = result.fold(
            errors => errors,
            () => null
        );
        return errors;
    }

    async submit() {
        if (this.state.isValid) {
            const creationResult = this.createNotification(this.state);

            const sendResult = await this.sendPushNotificationUseCase.execute(
                creationResult.getOrThrow()
            );

            sendResult.fold(
                (error: SendPushNotificationError) => this.changeState(this.handleError(error)),
                () =>
                    this.changeState({
                        ...this.state,
                        result: {
                            kind: "FormResultSuccess",
                            message: "Push notification sent successfully",
                        },
                    })
            );
        } else {
            this.changeState({ ...this.state });
        }
    }

    private handleError(error: SendPushNotificationError): FormState {
        switch (error.kind) {
            case "Unauthorized":
                return {
                    ...this.state,
                    result: { kind: "FormResultError", message: "Invalid credentials" },
                };
            case "ApiError":
                return {
                    ...this.state,
                    result: {
                        kind: "FormResultError",
                        message: `${error.error}: ${error.message}`,
                    },
                };
            case "UnexpectedError":
                return {
                    ...this.state,
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
}

export default SendPushNotificationBloc;

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
        required: true,
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
        required: true,
    },
    { label: "Url", name: "url", required: true },
    { label: "Title", name: "title", required: true },
    { label: "Description", name: "description", required: true },
];
