export interface ApiError {
    kind: "ApiError";
    error: string;
    statusCode: number;
    message: string;
}

export interface UnexpectedError {
    kind: "UnexpectedError";
    message: Error;
}

export interface Unauthorized {
    kind: "Unauthorized";
}

export interface NotFound {
    kind: "NotFound";
}

export type DataError = ApiError | UnexpectedError | Unauthorized;
