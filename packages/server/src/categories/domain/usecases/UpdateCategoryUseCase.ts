import { Either, Category, CategoryData, Id, ValidationError } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { UpdateResourceUseCase } from "../../../common/domain/UpdateResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CategorysRepository from "../boundaries/CategoryRepository";

export class UpdateCategoryUseCase extends UpdateResourceUseCase<CategoryData, Category> {
    constructor(private CategoryRepository: CategorysRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected createEntity(data: CategoryData): Either<ValidationError<CategoryData>[], Category> {
        return Category.create(data);
    }

    protected getEntityById(
        id: Id
    ): Promise<Either<UnexpectedError | ResourceNotFoundError, Category>> {
        return this.CategoryRepository.getById(id);
    }

    protected saveEntity(entity: Category): Promise<Either<UnexpectedError, ActionResult>> {
        return this.CategoryRepository.save(entity);
    }

    protected updateEntity(
        data: CategoryData,
        entity: Category
    ): Either<ValidationError<CategoryData>[], Category> {
        return entity.update(data);
    }
}
