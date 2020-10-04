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

export type DataError = ApiError | UnexpectedError | Unauthorized;
