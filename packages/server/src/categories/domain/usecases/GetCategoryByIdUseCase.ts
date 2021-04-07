import { Either, CategoryData, Category, Id } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { GetResourceByIdUseCase } from "../../../common/domain/GetResourceByIdUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CategorysRepository from "../boundaries/CategoryRepository";

export class GetCategoryByIdUseCase extends GetResourceByIdUseCase<CategoryData, Category> {
    constructor(private CategoryRepository: CategorysRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected getEntityById(
        id: Id
    ): Promise<Either<ResourceNotFoundError | UnexpectedError, Category>> {
        return this.CategoryRepository.getById(id);
    }
}
