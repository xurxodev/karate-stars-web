import { EitherAsync, Id } from "karate-stars-core";
import { DataError } from "./Errors";

export function createIdOrUnexpectedError(id: string): EitherAsync<DataError, Id> {
    const error = {
        kind: "UnexpectedError",
        message: new Error(`Id ${id} not found`),
    } as DataError;

    return EitherAsync.fromEither(Id.createExisted(id)).mapLeft(() => error);
}
