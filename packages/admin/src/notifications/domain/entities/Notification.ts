import { validateRequired, ValidationError } from "karate-stars-core";

export const COMPETITOR_NEWS_TOPIC = "competitor_notification";
export const VIDEO_NEWS_TOPIC = "video_notification";
export const URL_NEWS_TOPIC = "url_notification";

export const DEBUG_COMPETITOR_NEWS_TOPIC = "debug_competitor_notification";
export const DEBUG_VIDEO_NEWS_TOPIC = "debug_video_notification";
export const DEBUG_URL_NEWS_TOPIC = "debug_url_notification";

export interface NotificationObjectData {
    title: string;
    description: string;
    topic: string;
}

export interface NotificationData {
    topic: string;
    title: string;
    description: string;
}

export abstract class Notification {
    public readonly title: string;
    public readonly description: string;
    public readonly topic: string;

    constructor(data: NotificationObjectData) {
        this.title = data.title;
        this.description = data.description;
        this.topic = data.topic;
    }

    public static validateBase({
        topic,
        title,
        description,
    }: NotificationData): ValidationError<NotificationData>[] {
        const errors: ValidationError<Notification>[] = [
            { property: "topic" as const, errors: validateRequired(topic), value: topic },
            { property: "title" as const, errors: validateRequired(title), value: title },
            {
                property: "description" as const,
                errors: validateRequired(description),
                value: description,
            },
        ]
            .map(error => ({ ...error, type: Notification.name }))
            .filter(validation => validation.errors.length > 0);

        return errors;
    }
}
