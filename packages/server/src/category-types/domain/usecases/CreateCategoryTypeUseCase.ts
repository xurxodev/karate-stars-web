import { Either, CategoryTypeData, CategoryType, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createResource, CreateResourceError } from "../../../common/domain/CreateResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CategoryTypeRepository from "../boundaries/CategoryTypeRepository";

export interface CreateResourceArgs extends AdminUseCaseArgs {
    data: CategoryTypeData;
}

export class CreateCategoryTypeUseCase extends AdminUseCase<
    CreateResourceArgs,
    CreateResourceError<CategoryTypeData>,
    ActionResult
> {
    constructor(
        private categoryTypeRepository: CategoryTypeRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({
        data,
    }: CreateResourceArgs): Promise<Either<CreateResourceError<CategoryTypeData>, ActionResult>> {
        const createEntity = (data: CategoryTypeData) => CategoryType.create(data);
        const getById = (id: Id) => this.categoryTypeRepository.getById(id);
        const saveEntity = (entity: CategoryType) => this.categoryTypeRepository.save(entity);

        return createResource(data, createEntity, getById, saveEntity);
    }
}
