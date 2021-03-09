import { PushNotification } from "./PushNotification";
import { Url, Either, ValidationError } from "karate-stars-core";
import { validateRequired } from "karate-stars-core";

export interface NotificationUrlData {
    topic: string;
    title: string;
    description: string;
    url: Url;
}

export interface NotificationUrlInput {
    topic: string;
    title: string;
    description: string;
    url: string;
}

export class UrlNotification extends PushNotification {
    public readonly url: Url;

    private constructor({ topic, title, description, url }: NotificationUrlData) {
        super({ title, description, topic });
        this.url = url;
    }

    public static create({
        topic,
        title,
        description,
        url,
    }: NotificationUrlInput): Either<ValidationError<UrlNotification>[], UrlNotification> {
        const urlValue = Url.create(url);

        const errors: ValidationError<UrlNotification>[] = [
            { property: "topic" as const, errors: validateRequired(topic), value: topic },
            { property: "title" as const, errors: validateRequired(title), value: title },
            {
                property: "description" as const,
                errors: validateRequired(description),
                value: description,
            },
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
