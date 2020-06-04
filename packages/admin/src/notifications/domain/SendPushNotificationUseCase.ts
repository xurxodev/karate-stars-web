import { PushNotificationRepository, SendPushNotificationSuccess } from "./Boundaries";
import { SendPushNotificationError } from "./Errors";
import { UrlNotification } from "./entities/UrlNotification";
import { Either } from "karate-stars-core";

export default class SendPushNotificationUseCase {
    private pushNotificationRepository: PushNotificationRepository;

    constructor(pushNotificationRepository: PushNotificationRepository) {
        this.pushNotificationRepository = pushNotificationRepository;
    }

    execute(
        notification: UrlNotification
    ): Promise<Either<SendPushNotificationError, SendPushNotificationSuccess>> {
        return this.pushNotificationRepository.send(notification);
    }
}
