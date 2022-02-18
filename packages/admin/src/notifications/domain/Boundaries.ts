import { SendPushNotificationError } from "./Errors";
import { Notification } from "./entities/Notification";
import { Either } from "karate-stars-core";

export type SendPushNotificationSuccess = true;

export interface PushNotificationRepository {
    send(
        notification: Notification
    ): Promise<Either<SendPushNotificationError, SendPushNotificationSuccess>>;
}
