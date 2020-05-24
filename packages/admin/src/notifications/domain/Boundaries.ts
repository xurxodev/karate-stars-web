import { Either } from "../../common/domain/Either";
import { SendPushNotificationError } from "./Errors";
import { UrlNotification } from "./entities/UrlNotification";

export type SendPushNotificationSuccess = true;

export interface PushNotificationRepository {
    send(notification: UrlNotification): Promise<Either<SendPushNotificationError, SendPushNotificationSuccess>>;
}