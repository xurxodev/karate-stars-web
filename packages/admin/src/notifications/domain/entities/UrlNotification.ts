import { PushNotification } from "./PushNotification";
import { Url, Either } from "karate-stars-core";
import { ValidationErrorsDictionary, validateRequired } from "karate-stars-core";

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
    }: NotificationUrlInput): Either<ValidationErrorsDictionary, UrlNotification> {
        const urlValue = Url.create(url);

        debugger;
        const errors: ValidationErrorsDictionary = {
            topic: validateRequired(topic, "topic"),
            title: validateRequired(title, "title"),
            description: validateRequired(description, "description"),
            url: urlValue.fold(
                errors => errors,
                () => []
            ),
        };

        Object.keys(errors).forEach(
            (key: string) => errors[key].length === 0 && delete errors[key]
        );

        if (Object.keys(errors).length === 0) {
            return Either.right(
                new UrlNotification({ title, description, topic, url: urlValue.getOrThrow() })
            );
        } else {
            return Either.left(errors);
        }
    }
}
