import { SendPushNotificationError } from "./Errors";
import { UrlNotification } from "./entities/UrlNotification";
import { Either } from "karate-stars-core";

export type SendPushNotificationSuccess = true;

export interface PushNotificationRepository {
    send(
        notification: UrlNotification
    ): Promise<Either<SendPushNotificationError, SendPushNotificationSuccess>>;
}
