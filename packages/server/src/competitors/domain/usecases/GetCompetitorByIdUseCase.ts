import { Either, CompetitorData } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CompetitorRepository from "../boundaries/CompetitorRepository";

export interface GetCompetitorByIdArg extends AdminUseCaseArgs {
    id: string;
}

type GetCompetitorByIdError = ResourceNotFoundError | UnexpectedError;

export class GetCompetitorByIdUseCase extends AdminUseCase<
    GetCompetitorByIdArg,
    GetCompetitorByIdError,
    CompetitorData
> {
    constructor(
        private competitorRepository: CompetitorRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    public async run({
        id,
    }: GetCompetitorByIdArg): Promise<Either<GetCompetitorByIdError, CompetitorData>> {
        const result = await createIdOrResourceNotFound<GetCompetitorByIdError>(id)
            .flatMap(id => this.competitorRepository.getById(id))
            .map(entity => entity.toData())
            .run();

        return result;
    }
}
