import { ApiError, UnexpectedError, Unauthorized } from "../../common/domain/Errors";

export type GetUserError = ApiError | UnexpectedError | Unauthorized;
