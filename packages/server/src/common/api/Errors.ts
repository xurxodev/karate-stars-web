import { ValidationErrorsDictionary } from "karate-stars-core";

export type UnexpectedError = {
    kind: "UnexpectedError";
    error: Error;
};

export type ResourceNotFoundError = {
    kind: "ResourceNotFound";
    message: string;
};

export type UnauthorizedError = {
    kind: "Unauthorized";
    message: string;
};

export type ValidationError = {
    kind: "ValidationError";
    errors: ValidationErrorsDictionary;
};

export type ConflictError = {
    kind: "ConflictError";
    message: string;
};
