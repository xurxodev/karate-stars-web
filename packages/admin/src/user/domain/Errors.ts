export interface ApiError {
    kind: "ApiError";
    message: string
}

export interface InvalidCredentials {
    kind: "InvalidCredentials";
}

export type UserError = InvalidCredentials | ApiError