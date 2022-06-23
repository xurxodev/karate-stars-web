import { Either } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";

import RankingRepository from "../boundaries/RankingRepository";
import { Ranking } from "../entities/Ranking";

export class GetRankingsUseCase {
    constructor(private rankingRepository: RankingRepository) {}

    public async execute(): Promise<Either<UnexpectedError, Ranking[]>> {
        const rankings = await this.rankingRepository.getAll();

        return Either.right(rankings);
    }
}
