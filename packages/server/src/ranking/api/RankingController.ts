import { JwtAuthenticator } from "../../server";
import { runGetAll } from "../../common/api/AdminController";
import * as hapi from "@hapi/hapi";
import { GetRankingsUseCase } from "../domain/usecases/GetRankingsUseCase";

export class RankingController {
    constructor(
        private jwtAuthenticator: JwtAuthenticator,
        private getRankingsUseCase: GetRankingsUseCase
    ) {}

    async getAll(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runGetAll(request, h, this.jwtAuthenticator, _userId =>
            this.getRankingsUseCase.execute()
        );
    }
}
