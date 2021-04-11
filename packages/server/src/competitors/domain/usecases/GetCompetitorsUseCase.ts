import { Either, CompetitorData } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";

import CompetitorRepository from "../boundaries/CompetitorRepository";

export class GetCompetitorsUseCase extends AdminUseCase<
    AdminUseCaseArgs,
    UnexpectedError,
    CompetitorData[]
> {
    constructor(
        private competitorRepository: CompetitorRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    public async run(_: AdminUseCaseArgs): Promise<Either<UnexpectedError, CompetitorData[]>> {
        const competitors = await this.competitorRepository.getAll();

        return Either.right(competitors.map(competitor => competitor.toData()));
    }
}
