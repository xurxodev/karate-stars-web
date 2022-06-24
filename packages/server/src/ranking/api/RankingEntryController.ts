import { JwtAuthenticator } from "../../server";
import { handleFailure } from "../../common/api/AdminController";
import * as hapi from "@hapi/hapi";
import { GetRankingEntriesUseCase } from "../domain/usecases/GetRankingEntriesUseCase";
import * as boom from "@hapi/boom";

export class RankingEntryController {
    constructor(
        private _jwtAuthenticator: JwtAuthenticator,
        private getRankingEntriesUseCase: GetRankingEntriesUseCase
    ) {}

    async get(
        request: hapi.Request,
        _h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        const rankingId = request.query.rankingId;
        const categoryId = request.query.categoryId;

        if (!rankingId || !categoryId) {
            return boom.badRequest("rankingId and categoryId parameters are required");
        }

        const result = await this.getRankingEntriesUseCase.execute({ rankingId, categoryId });

        return result.fold(
            error => handleFailure(error),
            async data => data
        );
    }
}
