import { CompetitorRepository } from "./Boundaries";
import { Competitor, CompetitorData, Either } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";
import { createIdOrUnexpectedError } from "../../common/domain/utils";

export default class GetCompetitorByIdUseCase {
    constructor(private competitorRepository: CompetitorRepository) {}

    async execute(id: string): Promise<Either<DataError, CompetitorData>> {
        return await createIdOrUnexpectedError(id)
            .flatMap<Competitor>(id => this.competitorRepository.getById(id))
            .map(newsFeed => newsFeed.toData())
            .run();
    }
}
