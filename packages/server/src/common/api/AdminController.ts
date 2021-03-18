import * as hapi from "@hapi/hapi";
import * as boom from "@hapi/boom";
import { JwtAuthenticator } from "../../server";
import { ConflictError, UnexpectedError, ResourceNotFoundError, ValidationErrors } from "./Errors";
import { Either, EntityRawData, validationErrorMessages } from "karate-stars-core";
import { AdminUseCaseError } from "../domain/AdminUseCase";
import { ActionResult } from "./ActionResult";

export type UseCaseErrors<T extends EntityRawData> =
    | AdminUseCaseError
    | ResourceNotFoundError
    | UnexpectedError
    | ConflictError
    | ValidationErrors<T>;

export abstract class AdminController<T extends EntityRawData> {
    constructor(private jwtAuthenticator: JwtAuthenticator) {}

    protected abstract executeGetAll(userId: string): Promise<Either<UseCaseErrors<T>, T[]>>;
    protected abstract executeGet(userId: string, id: string): Promise<Either<UseCaseErrors<T>, T>>;
    protected abstract executePost(
        userId: string,
        item: T
    ): Promise<Either<UseCaseErrors<T>, ActionResult>>;
    protected abstract executePut(
        userId: string,
        itemId: string,
        item: T
    ): Promise<Either<UseCaseErrors<T>, ActionResult>>;
    protected abstract executeDelete(
        userId: string,
        id: string
    ): Promise<Either<UseCaseErrors<T>, ActionResult>>;

    async getAll(
        request: hapi.Request,
        _h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        const { userId } = this.jwtAuthenticator.decodeTokenData(request.headers.authorization);

        const result = await this.executeGetAll(userId);

        return result.fold(
            error => this.handleFailure(error),
            data => data
        );
    }

    async get(
        request: hapi.Request,
        _h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        const { userId } = this.jwtAuthenticator.decodeTokenData(request.headers.authorization);

        const id = request.params.id;

        const result = await this.executeGet(userId, id);

        return result.fold(
            error => this.handleFailure(error),
            data => data
        );
    }

    async post(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        const { userId } = this.jwtAuthenticator.decodeTokenData(request.headers.authorization);

        const payload = request.payload as T;

        if (payload) {
            const result = await this.executePost(userId, payload);

            return result.fold(
                error => this.handleFailure(error),
                result => h.response(result).code(201)
            );
        } else {
            return boom.badRequest("A body request with the resource to create is required");
        }
    }

    async put(
        request: hapi.Request,
        _h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        const { userId } = this.jwtAuthenticator.decodeTokenData(request.headers.authorization);

        const id = request.params.id;
        const payload = request.payload as T;

        if (payload) {
            const result = await this.executePut(userId, id, payload);

            return result.fold(
                error => this.handleFailure(error),
                result => result
            );
        } else {
            return boom.badRequest("A body request with the resource to create is required");
        }
    }

    async delete(
        request: hapi.Request,
        _h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        const { userId } = this.jwtAuthenticator.decodeTokenData(request.headers.authorization);

        const id = request.params.id;

        const result = await this.executeDelete(userId, id);

        return result.fold(
            error => this.handleFailure(error),
            newsFeeds => newsFeeds
        );
    }

    handleFailure(error: UseCaseErrors<T>): hapi.Lifecycle.ReturnValue {
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
                        error.errors.map(err =>
                            validationErrorMessages[err](error.property as string)
                        )
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
}
