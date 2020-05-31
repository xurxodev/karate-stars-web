import { ApiError, UnexpectedError, Unauthorized } from "../../common/domain/Errors";

export type SendPushNotificationError = ApiError | UnexpectedError | Unauthorized;
