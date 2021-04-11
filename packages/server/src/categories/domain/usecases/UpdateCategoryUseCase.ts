import { Either, CategoryData, Category, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { updateResource, UpdateResourceError } from "../../../common/domain/UpdateResourceUseCase";
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
    constructor(private categoryRepository: CategoryRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected run({
        id,
        data,
    }: UpdateResourceArgs): Promise<Either<UpdateResourceError<CategoryData>, ActionResult>> {
        const updateEntity = (data: CategoryData, entity: Category) => entity.update(data);
        const getById = (id: Id) => this.categoryRepository.getById(id);
        const saveEntity = (entity: Category) => this.categoryRepository.save(entity);

        return updateResource(id, data, getById, updateEntity, saveEntity);
    }
}
