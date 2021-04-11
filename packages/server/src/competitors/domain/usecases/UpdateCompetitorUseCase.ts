import { Either, CompetitorData, Competitor, Id, ValidationTypes } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { updateResource, UpdateResourceError } from "../../../common/domain/UpdateResource";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CompetitorRepository from "../boundaries/CompetitorRepository";

export interface UpdateResourceArgs extends AdminUseCaseArgs {
    id: string;
    data: CompetitorData;
}

export class UpdateCompetitorUseCase extends AdminUseCase<
    UpdateResourceArgs,
    UpdateResourceError<ValidationTypes>,
    ActionResult
> {
    constructor(
        private competitorRepository: CompetitorRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({
        id,
        data,
    }: UpdateResourceArgs): Promise<Either<UpdateResourceError<ValidationTypes>, ActionResult>> {
        const updateEntity = (data: CompetitorData, entity: Competitor) => entity.update(data);
        const getById = (id: Id) => this.competitorRepository.getById(id);
        const saveEntity = (entity: Competitor) => this.competitorRepository.save(entity);

        return updateResource(id, data, getById, updateEntity, saveEntity);
    }
}
