import { CompetitorRepository } from "./Boundaries";
import { CompetitorData, Either } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class GetCompetitorsUseCase {
    constructor(private competitorRepository: CompetitorRepository) {}

    async execute(): Promise<Either<DataError, CompetitorData[]>> {
        const response = await this.competitorRepository.getAll();

        return response.map(items => items.map(item => item.toData()));
    }
}
