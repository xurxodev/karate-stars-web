import { Either, CategoryData, Category, Id, ValidationError } from "karate-stars-core";
import CategoryTypeRepository from "../../../category-types/domain/boundaries/CategoryTypeRepository";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { updateResource, UpdateResourceError } from "../../../common/domain/UpdateResource";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CategoryRepository from "../boundaries/CategoryRepository";

export interface UpdateResourceArgs extends AdminUseCaseArgs {
    id: string;
    data: CategoryData;
}

export class UpdateCategoryUseCase extends AdminUseCase<
    UpdateResourceArgs,
    UpdateResourceError<CategoryData>,
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
        id,
        data,
    }: UpdateResourceArgs): Promise<Either<UpdateResourceError<CategoryData>, ActionResult>> {
        const updateEntity = (data: CategoryData, entity: Category) => entity.update(data);
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
        return updateResource(id, data, getById, updateEntity, saveEntity, validateDependencies);
    }
}
