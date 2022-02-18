import { Notification, NotificationData, NotificationObjectData } from "./Notification";
import { Url, Either, ValidationError } from "karate-stars-core";

export interface NotificationUrlObjectData extends NotificationObjectData {
    url: Url;
}

export interface NotificationUrlData extends NotificationData {
    url: string;
}

export class UrlNotification extends Notification {
    public readonly url: Url;

    private constructor({ topic, title, description, url }: NotificationUrlObjectData) {
        super({ title, description, topic });
        this.url = url;
    }

    public static create({
        topic,
        title,
        description,
        url,
    }: NotificationUrlData): Either<ValidationError<UrlNotification>[], UrlNotification> {
        const urlValue = Url.create(url);

        const errors: ValidationError<UrlNotification>[] = [
            ...super.validateBase({ topic, title, description }),
            {
                property: "url" as const,
                errors: urlValue.fold(
                    errors => errors,
                    () => []
                ),
                value: url,
            },
        ]
            .map(error => ({ ...error, type: UrlNotification.name }))
            .filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(
                new UrlNotification({ title, description, topic, url: urlValue.getOrThrow() })
            );
        } else {
            return Either.left(errors);
        }
    }
}
