import * as hapi from "@hapi/hapi";
import * as boom from "@hapi/boom";
import jwtAuthentication from "../authentication/JwtAuthentication";
import { GetNewsFeedsUseCase } from "../../domain/newsFeeds/usecases/GetNewsFeedsUseCase";
import { AdminUseCaseError } from "../../domain/common/AdminUseCase";

export default class NewsFeedsController {
    private getNewsFeedsUseCase: GetNewsFeedsUseCase;

    constructor(getNewsFeedsUseCase: GetNewsFeedsUseCase) {
        this.getNewsFeedsUseCase = getNewsFeedsUseCase;
    }

    public async getAll(
        request: hapi.Request,
        _: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        const token = request.headers.authorization;

        const userId = jwtAuthentication.decodeToken(token.replace("Bearer ", "")).userId;

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
