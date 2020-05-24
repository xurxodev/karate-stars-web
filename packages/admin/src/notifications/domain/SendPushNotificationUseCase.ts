import { PushNotificationRepository, SendPushNotificationSuccess } from "./Boundaries";
import { SendPushNotificationError } from "./Errors";
import { Either } from "../../common/domain/Either";
import { UrlNotification } from "./entities/UrlNotification";

export default class SendPushNotificationUseCase {
    private pushNotificationRepository: PushNotificationRepository;

    constructor(pushNotificationRepository: PushNotificationRepository) {
        this.pushNotificationRepository = pushNotificationRepository;
    }

    execute(notification: UrlNotification): Promise<Either<SendPushNotificationError, SendPushNotificationSuccess>> {
        return this.pushNotificationRepository.send(notification);
    }
}