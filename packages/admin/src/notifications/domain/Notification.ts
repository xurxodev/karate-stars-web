import { Either } from "../../common/domain/Either";
import { Url } from "../../common/domain/types/Url";

const COMPETITOR_NEWS_TOPIC = "competitornews";
const VIDEO_NEWS_TOPIC = "videonews";
const URL_NEWS_TOPIC = "urlnews";

const DEBUG_COMPETITOR_NEWS_TOPIC = "debugcompetitornews";
const DEBUG_VIDEO_NEWS_TOPIC = "debugvideonews";
const DEBUG_URL_NEWS_TOPIC = "debugurlnews";

interface NotificationData {
    mode: string;
    title: string;
    description: string;
    topic: string;
}

abstract class Notification {
    public readonly mode: string;
    public readonly title: string;
    public readonly description: string;
    public readonly topic: string;

    constructor(data: NotificationData) {
        this.mode = data.mode;
        this.title = data.title;
        this.description = data.description;
        this.topic = data.topic
    }
}

export type NotificationErrors = Record<string, string[]>;

interface NotificationUrlData {
    mode: string;
    title: string;
    description: string;
    url: string
}

export default class UrlNotification extends Notification {
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

        if (Object.keys(errors).length == 0) {
            return Either.right(new UrlNotification({ mode, title, description, url }));
        } else {
            return Either.left(errors as NotificationErrors);
        }
    }
}



