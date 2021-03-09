import { FormState, FormSectionState } from "../../common/presentation/state/FormState";
import { URL_NEWS_TOPIC, DEBUG_URL_NEWS_TOPIC } from "../domain/entities/PushNotification";
import { UrlNotification } from "../domain/entities/UrlNotification";
import SendPushNotificationUseCase from "../domain/SendPushNotificationUseCase";
import { SendPushNotificationError } from "../domain/Errors";
import { Either, ValidationError } from "karate-stars-core";
import FormBloc from "../../common/presentation/bloc/FormBloc";

class SendPushNotificationBloc extends FormBloc<UrlNotification> {
    constructor(private sendPushNotificationUseCase: SendPushNotificationUseCase) {
        super({
            isValid: false,
            sections: initialFieldsState,
        });
    }

    protected validateState(state: FormState): ValidationError<UrlNotification>[] | null {
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
                        message: `Sorry, an error has ocurred in the server. Please try later again`,
                    },
                };
            case "UnexpectedError":
                return {
                    ...this.state,
                    result: {
                        kind: "FormResultError",
                        message: `Sorry, an error has ocurred. Please try later again`,
                    },
                };
        }
    }

    private createNotification(
        state: FormState
    ): Either<ValidationError<UrlNotification>[], UrlNotification> {
        const notificationDataFields = state.sections.flatMap(section =>
            section.fields.map(field => ({ [field.name]: field.value }))
        );
        const notificationData = Object.assign({}, ...notificationDataFields);

        return UrlNotification.create(notificationData);
    }
}

export default SendPushNotificationBloc;

const initialFieldsState: FormSectionState[] = [
    {
        fields: [
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
        ],
    },
];
