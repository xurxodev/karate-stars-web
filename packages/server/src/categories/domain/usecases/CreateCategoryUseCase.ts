import { Either, CategoryData, Category, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createResource, CreateResourceError } from "../../../common/domain/CreateResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CategoryRepository from "../boundaries/CategoryRepository";

export interface CreateResourceArgs extends AdminUseCaseArgs {
    data: CategoryData;
}

export class CreateCategoryUseCase extends AdminUseCase<
    CreateResourceArgs,
    CreateResourceError<CategoryData>,
    ActionResult
> {
    constructor(private categoryRepository: CategoryRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected run({
        data,
    }: CreateResourceArgs): Promise<Either<CreateResourceError<CategoryData>, ActionResult>> {
        const createEntity = (data: CategoryData) => Category.create(data);
        const getById = (id: Id) => this.categoryRepository.getById(id);
        const saveEntity = (entity: Category) => this.categoryRepository.save(entity);

        return createResource(data, createEntity, getById, saveEntity);
    }
}
