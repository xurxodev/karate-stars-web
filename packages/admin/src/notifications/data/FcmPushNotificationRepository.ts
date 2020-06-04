import { PushNotificationRepository, SendPushNotificationSuccess } from "../domain/Boundaries";
import { SendPushNotificationError } from "../domain/Errors";
import { AxiosInstance } from "axios";
import { UrlNotification } from "../domain/entities/UrlNotification";
import { Either, Left } from "karate-stars-core";

class FcmPushNotificationRepository implements PushNotificationRepository {
    constructor(private axiosInstance: AxiosInstance, private fcmApiToken: string) {}

    async send(
        notification: UrlNotification
    ): Promise<Either<SendPushNotificationError, SendPushNotificationSuccess>> {
        try {
            //const data = this.extractDataByType(notification);

            debugger;

            await this.axiosInstance.post(
                "/send",
                {
                    to: `/topics/${notification.topic}`,
                    data: {
                        notification_title: notification.title,
                        notification_text: notification.description,
                        url: notification.url.value,
                    },
                },
                { headers: { authorization: `key=${this.fcmApiToken}` } }
            );

            return Either.right(true);
        } catch (error) {
            return this.handleError(error);
        }
    }

    private handleError(error: any): Left<SendPushNotificationError> {
        if (error.response?.data?.statusCode) {
            return error.response.data.statusCode === 401
                ? Either.left({ kind: "Unauthorized" })
                : Either.left({
                      kind: "ApiError",
                      error: error.response.data.error,
                      statusCode: error.response.data.statusCode,
                      message: error.response.data.message,
                  });
        } else if (typeof error.response?.data === "string") {
            return Either.left({ kind: "UnexpectedError", message: error.response.data });
        } else {
            return Either.left({ kind: "UnexpectedError", message: error.message });
        }
    }
}

export default FcmPushNotificationRepository;
