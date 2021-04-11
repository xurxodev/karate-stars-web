import { Either, CompetitorData, Competitor, Id, ValidationTypes } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createResource, CreateResourceError } from "../../../common/domain/CreateResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CompetitorRepository from "../boundaries/CompetitorRepository";

export interface CreateResourceArgs extends AdminUseCaseArgs {
    data: CompetitorData;
}

export class CreateCompetitorUseCase extends AdminUseCase<
    CreateResourceArgs,
    CreateResourceError<ValidationTypes>,
    ActionResult
> {
    constructor(
        private competitorRepository: CompetitorRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({
        data,
    }: CreateResourceArgs): Promise<Either<CreateResourceError<ValidationTypes>, ActionResult>> {
        const createEntity = (data: CompetitorData) => Competitor.create(data);
        const getById = (id: Id) => this.competitorRepository.getById(id);
        const saveEntity = (entity: Competitor) => this.competitorRepository.save(entity);

        return createResource(data, createEntity, getById, saveEntity);
    }
}
