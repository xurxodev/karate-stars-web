import * as hapi from "@hapi/hapi";
import * as boom from "@hapi/boom";
import { GetNewsFeedsUseCase } from "../../domain/newsFeeds/usecases/GetNewsFeedsUseCase";
import { AdminUseCaseError } from "../../domain/common/AdminUseCase";
import { JwtAuthenticator } from "../../server";
import { GetNewsFeedByIdUseCase } from "../../domain/newsFeeds/usecases/GetNewsFeedByIdUseCase";
import {
    ConflictError,
    UnexpectedError,
    ValidationError,
    ResourceNotFoundError,
} from "../common/Errors";
import { DeleteNewsFeedUseCase } from "../../domain/newsFeeds/usecases/DeleteNewsFeedUseCase";
import { NewsFeedRawData, validationErrorMessages } from "karate-stars-core";
import { CreateNewsFeedUseCase } from "../../domain/newsFeeds/usecases/CreateNewsFeedUseCase";
import { UpdateNewsFeedUseCase } from "../../domain/newsFeeds/usecases/UpdateNewsFeedUseCase";

export default class NewsFeedsController {
    constructor(
        private jwtAuthenticator: JwtAuthenticator,
        private getNewsFeedsUseCase: GetNewsFeedsUseCase,
        private getNewsFeedByIdUseCase: GetNewsFeedByIdUseCase,
        private createNewsFeedUseCase: CreateNewsFeedUseCase,
        private updateNewsFeedUseCase: UpdateNewsFeedUseCase,
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

        const payload = request.payload as NewsFeedRawData;

        if (payload) {
            const result = await this.createNewsFeedUseCase.execute({ userId, item: payload });

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
        const payload = request.payload as NewsFeedRawData;

        if (payload) {
            const result = await this.updateNewsFeedUseCase.execute({
                userId,
                item: payload,
                itemId: id,
            });

            return result.fold(
                error => this.handleFailure(error),
                newsFeeds => newsFeeds
            );
        } else {
            return boom.badRequest("A body request with the resource to create is required");
        }
    }

    handleFailure(
        error:
            | AdminUseCaseError
            | ResourceNotFoundError
            | UnexpectedError
            | ConflictError
            | ValidationError
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
            case "ValidationError": {
                const message = Object.keys(error.errors)
                    .map(field =>
                        error.errors[field].map(errorByKey =>
                            validationErrorMessages[errorByKey](field)
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
