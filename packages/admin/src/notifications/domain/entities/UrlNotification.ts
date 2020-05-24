import { NotificationErrors, PushNotification, DEBUG_URL_NEWS_TOPIC } from "./PushNotification";
import { Either } from "../../../common/domain/Either";
import { Url } from "../../../common/domain/types/Url";

interface NotificationUrlData {
    mode: string;
    title: string;
    description: string;
    url: string
}

export class UrlNotification extends PushNotification {
    public readonly url: Url;

    private constructor({ mode, title, description, url }: NotificationUrlData) {
        super({ mode, title, description, topic: DEBUG_URL_NEWS_TOPIC });
        this.url = Url.create(url).value as Url;
    }

    public static create({ mode, title, description, url }: NotificationUrlData):
        Either<NotificationErrors, UrlNotification> {

        const urlValue = Url.create(url);

        const errors: NotificationErrors = {
            "mode": !mode ? ["Mode is required"] : [],
            "title": !title ? ["Title is required"] : [],
            "description": !description ? ["Description is required"] : [],
            "url": urlValue.fold(error => {
                switch (error.kind) {
                    case "InvalidEmptyUrl":
                        return ["Url is required"];
                    case "InvalidUrl":
                        return ["Invalid Url"]
                }
            }, () => []),
        }

        Object.keys(errors).forEach((key: string) => errors[key].length === 0 && delete errors[key]);

        if (Object.keys(errors).length === 0) {
            return Either.right(new UrlNotification({ mode, title, description, url }));
        } else {
            return Either.left(errors as NotificationErrors);
        }
    }
}