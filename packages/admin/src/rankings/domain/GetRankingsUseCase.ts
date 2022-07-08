import { RankingRepository } from "./Boundaries";
import { Either, RankingData } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class GetRankingsUseCase {
    constructor(private rankingRepository: RankingRepository) {}

    async execute(): Promise<Either<DataError, RankingData[]>> {
        const response = await this.rankingRepository.getAll();

        return response.map(items => items.map(item => item.toData()));
    }
}
