import * as hapi from "@hapi/hapi";
import * as boom from "@hapi/boom";
import { GetNewsFeedsUseCase } from "../../domain/newsFeeds/usecases/GetNewsFeedsUseCase";
import { AdminUseCaseError } from "../../domain/common/AdminUseCase";
import JwtAuthenticator from "../authentication/JwtAuthenticator";

export default class NewsFeedsController {
    constructor(
        private jwtAuthenticator: JwtAuthenticator,
        private getNewsFeedsUseCase: GetNewsFeedsUseCase
    ) {}

    public async getAll(
        request: hapi.Request,
        _: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        const token = request.headers.authorization;

        const userId = this.jwtAuthenticator.decodeToken(token.replace("Bearer ", "")).userId;

        const result = await this.getNewsFeedsUseCase.execute({ userId });

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
