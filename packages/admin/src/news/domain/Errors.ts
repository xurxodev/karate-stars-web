import { ApiError, UnexpectedError, Unauthorized } from "../../common/domain/Errors";

export type GetRssFeedListError = ApiError | UnexpectedError | Unauthorized;
