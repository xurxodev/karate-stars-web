import * as hapi from "@hapi/hapi";
import * as boom from "@hapi/boom";
import { GetNewsFeedsUseCase } from "../../domain/newsFeeds/usecases/GetNewsFeedsUseCase";
import { AdminUseCaseError } from "../../domain/common/AdminUseCase";
import { JwtAuthenticator } from "../../server";
import { GetNewsFeedByIdUseCase } from "../../domain/newsFeeds/usecases/GetNewsFeedByIdUseCase";

export default class NewsFeedsController {
    constructor(
        private jwtAuthenticator: JwtAuthenticator,
        private getNewsFeedsUseCase: GetNewsFeedsUseCase,
        private getNewsFeedByIdUseCase: GetNewsFeedByIdUseCase
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

    handleFailure(error: AdminUseCaseError): hapi.Lifecycle.ReturnValue {
        switch (error.kind) {
            case "ResourceNotFound": {
                return boom.notFound(error.message);
            }
            case "PermissionError": {
                return boom.forbidden(error.message);
            }
            case "UnexpectedError": {
                console.log({ error });
                return boom.internal();
            }
        }
    }
}
