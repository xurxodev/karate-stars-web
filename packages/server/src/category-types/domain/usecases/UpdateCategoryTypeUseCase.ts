import { Either, CategoryTypeData, CategoryType, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { updateResource, UpdateResourceError } from "../../../common/domain/UpdateResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CategoryTypeRepository from "../boundaries/CategoryTypeRepository";

export interface UpdateResourceArgs extends AdminUseCaseArgs {
    id: string;
    data: CategoryTypeData;
}

export class UpdateCategoryTypeUseCase extends AdminUseCase<
    UpdateResourceArgs,
    UpdateResourceError<CategoryTypeData>,
    ActionResult
> {
    constructor(
        private categoryTypeRepository: CategoryTypeRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({
        id,
        data,
    }: UpdateResourceArgs): Promise<Either<UpdateResourceError<CategoryTypeData>, ActionResult>> {
        const updateEntity = (data: CategoryTypeData, entity: CategoryType) => entity.update(data);
        const getById = (id: Id) => this.categoryTypeRepository.getById(id);
        const saveEntity = (entity: CategoryType) => this.categoryTypeRepository.save(entity);

        return updateResource(id, data, getById, updateEntity, saveEntity);
    }
}
