import * as hapi from "@hapi/hapi";
import * as boom from "@hapi/boom";
import { GetNewsFeedsUseCase } from "../domain/usecases/GetNewsFeedsUseCase";
import { JwtAuthenticator } from "../../server";
import {
    ConflictError,
    UnexpectedError,
    ResourceNotFoundError,
    ValidationErrors,
} from "../../common/api/Errors";
import { DeleteNewsFeedUseCase } from "../domain/usecases/DeleteNewsFeedUseCase";
import { NewsFeedData, validationErrorMessages } from "karate-stars-core";
import { CreateNewsFeedUseCase } from "../domain/usecases/CreateNewsFeedUseCase";
import { UpdateNewsFeedUseCase } from "../domain/usecases/UpdateNewsFeedUseCase";
import { UpdateNewsFeedImageUseCase } from "../domain/usecases/UpdateNewsFeedImageUseCase";
import { Readable } from "stream";
import { AdminUseCaseError } from "../../common/domain/AdminUseCase";
import { GetNewsFeedByIdUseCase } from "../domain/usecases/GetNewsFeedByIdUseCase";

export default class NewsFeedsController {
    constructor(
        private jwtAuthenticator: JwtAuthenticator,
        private getNewsFeedsUseCase: GetNewsFeedsUseCase,
        private getNewsFeedByIdUseCase: GetNewsFeedByIdUseCase,
        private createNewsFeedUseCase: CreateNewsFeedUseCase,
        private updateNewsFeedUseCase: UpdateNewsFeedUseCase,
        private updateNewsFeedImageUseCase: UpdateNewsFeedImageUseCase,
        private deleteNewsFeedUseCase: DeleteNewsFeedUseCase
    ) {}

    async getAll(
        request: hapi.Request,
        _h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        const { userId } = this.jwtAuthenticator.decodeTokenData(request.headers.authorization);

        const result = await this.getNewsFeedsUseCase.execute({ userId });

        return result.fold(
            error => this.handleFailure(error),
            newsFeeds => newsFeeds
        );
    }

    async get(
        request: hapi.Request,
        _h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        const { userId } = this.jwtAuthenticator.decodeTokenData(request.headers.authorization);

        const id = request.params.id;

        const result = await this.getNewsFeedByIdUseCase.execute({ userId, id });

        return result.fold(
            error => this.handleFailure(error),
            newsFeeds => newsFeeds
        );
    }

    async delete(
        request: hapi.Request,
        _h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        const { userId } = this.jwtAuthenticator.decodeTokenData(request.headers.authorization);

        const id = request.params.id;

        const result = await this.deleteNewsFeedUseCase.execute({ userId, id });

        return result.fold(
            error => this.handleFailure(error),
            newsFeeds => newsFeeds
        );
    }

    async post(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        const { userId } = this.jwtAuthenticator.decodeTokenData(request.headers.authorization);

        const payload = request.payload as NewsFeedData;

        if (payload) {
            const result = await this.createNewsFeedUseCase.execute({ userId, data: payload });

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
        const payload = request.payload as NewsFeedData;

        if (payload) {
            const result = await this.updateNewsFeedUseCase.execute({
                userId,
                data: payload,
                id: id,
            });

            return result.fold(
                error => this.handleFailure(error),
                result => result
            );
        } else {
            return boom.badRequest("A body request with the resource to create is required");
        }
    }

    async putImage(
        request: hapi.Request,
        _h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        const { userId } = this.jwtAuthenticator.decodeTokenData(request.headers.authorization);

        const id = request.params.id;
        const payload = request.payload;

        if (payload) {
            const stream = payload["file"] as Readable;
            const fileName = payload["file"].hapi.filename as string;

            const result = await this.updateNewsFeedImageUseCase.execute({
                userId,
                itemId: id,
                image: stream,
                filename: fileName,
            });

            return result.fold(
                error => this.handleFailure(error),
                result => result
            );
        } else {
            return boom.badRequest("A body request with the file to edit is required");
        }
    }

    handleFailure(
        error:
            | AdminUseCaseError
            | ResourceNotFoundError
            | UnexpectedError
            | ConflictError
            | ValidationErrors<NewsFeedData>
    ): hapi.Lifecycle.ReturnValue {
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
                        error.errors.map(err => validationErrorMessages[err](error.property))
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
