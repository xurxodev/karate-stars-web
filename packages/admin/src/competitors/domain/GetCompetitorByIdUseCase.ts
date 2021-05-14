import { CompetitorRepository } from "./Boundaries";
import { Competitor, CompetitorData, Either, EitherAsync, Id } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class GetCompetitorByIdUseCase {
    constructor(private competitorRepository: CompetitorRepository) {}

    async execute(id: string): Promise<Either<DataError, CompetitorData>> {
        return await EitherAsync.fromEither(Id.createExisted(id))
            .mapLeft(
                () =>
                    ({
                        kind: "UnexpectedError",
                        message: new Error(`Unexpected competitor id to delete ${id}`),
                    } as DataError)
            )
            .flatMap<Competitor>(id => this.competitorRepository.getById(id))
            .map(newsFeed => newsFeed.toData())
            .run();
    }
}
