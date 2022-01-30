import { ValidationError } from "karate-stars-core";

export type UnexpectedError = {
    kind: "UnexpectedError";
    error: unknown;
};

export type ResourceNotFoundError = {
    kind: "ResourceNotFound";
    message: string;
};

export type UnauthorizedError = {
    kind: "Unauthorized";
    message: string;
};

export type ValidationErrors<T> = {
    kind: "ValidationErrors";
    errors: ValidationError<T>[];
};

export type ConflictError = {
    kind: "ConflictError";
    message: string;
};
