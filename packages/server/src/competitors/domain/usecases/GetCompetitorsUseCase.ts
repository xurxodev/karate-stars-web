import { Either, CompetitorData } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";

import CompetitorRepository from "../boundaries/CompetitorRepository";

export class GetCompetitorsUseCase {
    constructor(private competitorRepository: CompetitorRepository) {}

    public async execute(): Promise<Either<UnexpectedError, CompetitorData[]>> {
        const competitors = await this.competitorRepository.getAll();

        return Either.right(competitors.map(competitor => competitor.toData()));
    }
}
