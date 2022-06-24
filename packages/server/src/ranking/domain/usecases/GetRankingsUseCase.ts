import { Either, RankingData } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";

import RankingRepository from "../boundaries/RankingRepository";

export class GetRankingsUseCase {
    constructor(private rankingRepository: RankingRepository) {}

    public async execute(): Promise<Either<UnexpectedError, RankingData[]>> {
        const rankings = await this.rankingRepository.getAll();

        return Either.right(rankings.map(ranking => ranking.toData()));
    }
}
