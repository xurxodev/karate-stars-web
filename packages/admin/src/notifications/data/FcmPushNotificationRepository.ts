import { PushNotificationRepository, SendPushNotificationSuccess } from "../domain/Boundaries";
import { SendPushNotificationError } from "../domain/Errors";
import { AxiosInstance } from "axios";
import { Notification } from "../domain/entities/Notification";
import { Either } from "karate-stars-core";
import { UrlNotification } from "../domain/entities/UrlNotification";
import { CompetitorNotification } from "../domain/entities/CompetitorNotification";
import { VideoNotification } from "../domain/entities/VideoNotification";

class FcmPushNotificationRepository implements PushNotificationRepository {
    constructor(private axiosInstance: AxiosInstance, private fcmApiToken: string) {}

    async send(
        notification: Notification
    ): Promise<Either<SendPushNotificationError, SendPushNotificationSuccess>> {
        try {
            if (notification instanceof UrlNotification) {
                await this.sendUrlNotification(notification);
            } else if (notification instanceof CompetitorNotification) {
                await this.sendCompetitorNotification(notification);
            } else if (notification instanceof VideoNotification) {
                await this.sendVideoNotification(notification);
            } else {
                return Either.left({
                    kind: "UnexpectedError",
                    message: new Error("Unrecognized notification"),
                });
            }

            return Either.right(true);
        } catch (error) {
            return this.handleError(error);
        }
    }

    private async sendUrlNotification(notification: UrlNotification) {
        await this.axiosInstance.post(
            "/send",
            {
                to: `/topics/${notification.topic}`,
                data: {
                    url: notification.url.value,
                },
                notification: {
                    title: notification.title,
                    body: notification.description,
                },
            },
            { headers: { authorization: `key=${this.fcmApiToken}` } }
        );

        return Either.right(true);
    }

    private async sendCompetitorNotification(notification: CompetitorNotification) {
        await this.axiosInstance.post(
            "/send",
            {
                to: `/topics/${notification.topic}`,
                data: {
                    competitorId: notification.competitorId.value,
                },
                notification: {
                    title: notification.title,
                    body: notification.description,
                },
            },
            { headers: { authorization: `key=${this.fcmApiToken}` } }
        );

        return Either.right(true);
    }

    private async sendVideoNotification(notification: VideoNotification) {
        await this.axiosInstance.post(
            "/send",
            {
                to: `/topics/${notification.topic}`,
                data: {
                    videoId: notification.videoId.value,
                },
                notification: {
                    title: notification.title,
                    body: notification.description,
                },
            },
            { headers: { authorization: `key=${this.fcmApiToken}` } }
        );

        return Either.right(true);
    }

    private handleError(
        error: any
    ): Either<SendPushNotificationError, SendPushNotificationSuccess> {
        if (error.response.status === 401) {
            return Either.left({ kind: "Unauthorized" });
        } else if (error.response?.data?.statusCode) {
            return Either.left({
                kind: "ApiError",
                error: error.response?.data?.error,
                statusCode: error.response.data.statusCode,
                message: error.response?.data?.message,
            });
        } else if (typeof error.response?.data === "string") {
            return Either.left({
                kind: "ApiError",
                error: error.response?.data,
                statusCode: error.response.status,
                message: error.response?.data,
            });
        } else {
            return Either.left({ kind: "UnexpectedError", message: error.message });
        }
    }
}

export default FcmPushNotificationRepository;
