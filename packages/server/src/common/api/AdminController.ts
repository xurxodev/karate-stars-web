import * as hapi from "@hapi/hapi";
import * as boom from "@hapi/boom";
import { JwtAuthenticator } from "../../server";
import { ConflictError, UnexpectedError, ResourceNotFoundError, ValidationErrors } from "./Errors";
import { Either, validationErrorMessages } from "karate-stars-core";
import { AdminUseCaseError } from "../domain/AdminUseCase";
import { ActionResult } from "./ActionResult";

export type UseCaseErrors<T> =
    | AdminUseCaseError
    | ResourceNotFoundError
    | UnexpectedError
    | ConflictError
    | ValidationErrors<T>;

export async function runGetAll<TData, TValidation>(
    request: hapi.Request,
    _h: hapi.ResponseToolkit,
    jwtAuthenticator: JwtAuthenticator,
    action: (userId: string) => Promise<Either<UseCaseErrors<TValidation>, TData[]>>
): Promise<hapi.Lifecycle.ReturnValue> {
    const { userId } = jwtAuthenticator.decodeTokenData(request.headers.authorization);

    const result = await action(userId);

    return result.fold(
        error => handleFailure(error),
        data => data
    );
}

export async function runGet<TData, TValidation>(
    request: hapi.Request,
    _h: hapi.ResponseToolkit,
    jwtAuthenticator: JwtAuthenticator,
    action: (userId: string, id: string) => Promise<Either<UseCaseErrors<TValidation>, TData>>
): Promise<hapi.Lifecycle.ReturnValue> {
    const { userId } = jwtAuthenticator.decodeTokenData(request.headers.authorization);

    const id = request.params.id;

    const result = await action(userId, id);

    return result.fold(
        error => handleFailure(error),
        async data => data
    );
}

export async function runPost<TData, TValidation>(
    request: hapi.Request,
    h: hapi.ResponseToolkit,
    jwtAuthenticator: JwtAuthenticator,
    action: (
        userId: string,
        data: TData
    ) => Promise<Either<UseCaseErrors<TValidation>, ActionResult>>
): Promise<hapi.Lifecycle.ReturnValue> {
    const { userId } = jwtAuthenticator.decodeTokenData(request.headers.authorization);

    const payload = (request.payload as unknown) as TData;

    if (payload) {
        const result = await action(userId, payload);

        return result.fold(
            error => handleFailure(error),
            dataResult => h.response(dataResult).code(201)
        );
    } else {
        return boom.badRequest("A body request with the resource to create is required");
    }
}

export async function runPut<TData, TValidation>(
    request: hapi.Request,
    h: hapi.ResponseToolkit,
    jwtAuthenticator: JwtAuthenticator,
    action: (
        userId: string,
        id: string,
        data: TData
    ) => Promise<Either<UseCaseErrors<TValidation>, ActionResult>>
): Promise<hapi.Lifecycle.ReturnValue> {
    const { userId } = jwtAuthenticator.decodeTokenData(request.headers.authorization);

    const payload = (request.payload as unknown) as TData;
    const id = request.params.id;

    if (payload) {
        const result = await action(userId, id, payload);

        return result.fold(
            error => handleFailure(error),
            dataResult => dataResult
        );
    } else {
        return boom.badRequest("A body request with the resource to update is required");
    }
}

export async function runDelete<TValidation>(
    request: hapi.Request,
    h: hapi.ResponseToolkit,
    jwtAuthenticator: JwtAuthenticator,
    action: (
        userId: string,
        id: string
    ) => Promise<Either<UseCaseErrors<TValidation>, ActionResult>>
): Promise<hapi.Lifecycle.ReturnValue> {
    const { userId } = jwtAuthenticator.decodeTokenData(request.headers.authorization);

    const id = request.params.id;
    const result = await action(userId, id);

    return result.fold(
        error => handleFailure(error),
        dataResult => dataResult
    );
}

function handleFailure<TData>(error: UseCaseErrors<TData>): hapi.Lifecycle.ReturnValue {
    switch (error.kind) {
        case "Unauthorized": {
            return boom.unauthorized(error.message);
        }
        case "ResourceNotFound": {
            return boom.notFound(error.message);
        }
        case "PermissionError": {
            return boom.forbidden(error.message);
        }
        case "ValidationErrors": {
            const message = error.errors
                .map(error =>
                    error.errors.map(err => validationErrorMessages[err](error.property as string))
                )
                .flat()
                .join(", ");

            return boom.badRequest(message);
        }
        case "ConflictError": {
            return boom.conflict(error.message);
        }
        case "UnexpectedError": {
            console.log({ error });
            return boom.internal(error.error.message);
        }
    }
}
