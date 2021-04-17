import { Either, CategoryData, Category, Id, ValidationError } from "karate-stars-core";
import CategoryTypeRepository from "../../../category-types/domain/boundaries/CategoryTypeRepository";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createResource, CreateResourceError } from "../../../common/domain/CreateResource";
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
    constructor(
        private categoryRepository: CategoryRepository,
        private categoryTypeRepository: CategoryTypeRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({
        data,
    }: CreateResourceArgs): Promise<Either<CreateResourceError<CategoryData>, ActionResult>> {
        const createEntity = (data: CategoryData) => Category.create(data);
        const getById = (id: Id) => this.categoryRepository.getById(id);
        const saveEntity = (entity: Category) => this.categoryRepository.save(entity);
        const validateDependencies = async (entity: Category) => {
            return (await this.categoryTypeRepository.getById(entity.typeId))
                .mapLeft(() => [
                    {
                        property: "typeId" as const,
                        errors: ["invalid_dependency"],
                        type: Category.name,
                        value: entity.typeId,
                    } as ValidationError<CategoryData>,
                ])
                .map(() => entity);
        };

        return createResource(data, createEntity, getById, saveEntity, validateDependencies);
    }
}
