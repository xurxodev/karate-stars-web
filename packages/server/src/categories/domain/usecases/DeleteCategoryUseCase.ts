import { Either, Category, CategoryData, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { DeleteResourceUseCase } from "../../../common/domain/DeleteResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CategoryRepository from "../boundaries/CategoryRepository";

export class DeleteCategoryUseCase extends DeleteResourceUseCase<CategoryData, Category> {
    constructor(private CategoryRepository: CategoryRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected getEntityById(
        id: Id
    ): Promise<Either<UnexpectedError | ResourceNotFoundError, Category>> {
        return this.CategoryRepository.getById(id);
    }

    protected deleteEntity(id: Id): Promise<Either<UnexpectedError, ActionResult>> {
        return this.CategoryRepository.delete(id);
    }
}
