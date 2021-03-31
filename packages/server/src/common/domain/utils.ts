import { EitherAsync, Id } from "karate-stars-core";
import { ResourceNotFoundError } from "../api/Errors";

export function createIdOrResourceNotFound<T>(
    id: string
): EitherAsync<ResourceNotFoundError | T, Id> {
    const notFoundError = {
        kind: "ResourceNotFound",
        message: `Id ${id} not found`,
    } as ResourceNotFoundError;

    return EitherAsync.fromEither(Id.createExisted(id)).mapLeft(() => notFoundError);
}
