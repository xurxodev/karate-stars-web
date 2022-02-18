import { Notification, NotificationData, NotificationObjectData } from "./Notification";
import { Either, ValidationError, Id } from "karate-stars-core";

export interface VideoNotificationObjectData extends NotificationObjectData {
    videoId: Id;
}

export interface VideoNotificationData extends NotificationData {
    videoId: string;
}

export class VideoNotification extends Notification {
    public readonly videoId: Id;

    private constructor({ topic, title, description, videoId }: VideoNotificationObjectData) {
        super({ title, description, topic });
        this.videoId = videoId;
    }

    public static create({
        topic,
        title,
        description,
        videoId,
    }: VideoNotificationData): Either<ValidationError<VideoNotification>[], VideoNotification> {
        const videoIdValue = Id.createExisted(videoId);

        const errors: ValidationError<VideoNotification>[] = [
            ...super.validateBase({ topic, title, description }),
            {
                property: "videoId" as const,
                errors: videoIdValue.fold(
                    errors => errors,
                    () => []
                ),
                value: videoId,
            },
        ]
            .map(error => ({ ...error, type: VideoNotification.name }))
            .filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(
                new VideoNotification({
                    title,
                    description,
                    topic,
                    videoId: videoIdValue.getOrThrow(),
                })
            );
        } else {
            return Either.left(errors);
        }
    }
}
