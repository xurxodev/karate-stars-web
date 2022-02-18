import {
    FormState,
    FormSectionState,
    statetoData,
} from "../../common/presentation/state/FormState";
import { URL_NEWS_TOPIC, DEBUG_URL_NEWS_TOPIC } from "../domain/entities/Notification";
import { UrlNotification } from "../domain/entities/UrlNotification";
import SendPushNotificationUseCase from "../domain/SendPushNotificationUseCase";
import { Either, ValidationError } from "karate-stars-core";
import SendNotificationBloc from "./SendNotificationBloc";

class SendUrlNotificationBloc extends SendNotificationBloc<UrlNotification> {
    constructor(sendPushNotificationUseCase: SendPushNotificationUseCase) {
        super(sendPushNotificationUseCase, {
            isValid: false,
            sections: initialFieldsState,
        });
    }

    protected createNotification(
        state: FormState
    ): Either<ValidationError<UrlNotification>[], UrlNotification> {
        return UrlNotification.create(statetoData(state));
    }
}

export default SendUrlNotificationBloc;

const initialFieldsState: FormSectionState[] = [
    {
        fields: [
            {
                kind: "FormSingleFieldState",
                label: "Topic",
                name: "topic",
                value: DEBUG_URL_NEWS_TOPIC,
                selectOptions: [
                    { id: DEBUG_URL_NEWS_TOPIC, name: "Debug" },
                    { id: URL_NEWS_TOPIC, name: "Real" },
                ],
                md: 6,
                xs: 12,
                required: true,
            },
            {
                kind: "FormSingleFieldState",
                label: "Url",
                name: "url",
                md: 6,
                xs: 12,
                required: true,
            },
            {
                kind: "FormSingleFieldState",
                label: "Title",
                name: "title",
                required: true,
                value: "Karate Stars - news",
                md: 6,
                xs: 12,
            },
            {
                kind: "FormSingleFieldState",
                label: "Description",
                name: "description",
                required: true,
                md: 6,
                xs: 12,
            },
        ],
    },
];
