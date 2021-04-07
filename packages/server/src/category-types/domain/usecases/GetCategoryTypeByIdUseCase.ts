import { Either, CategoryTypeData, CategoryType, Id } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { GetResourceByIdUseCase } from "../../../common/domain/GetResourceByIdUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CategoryTypesRepository from "../boundaries/CategoryTypeRepository";

export class GetCategoryTypeByIdUseCase extends GetResourceByIdUseCase<
    CategoryTypeData,
    CategoryType
> {
    constructor(
        private CategoryTypeRepository: CategoryTypesRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected getEntityById(
        id: Id
    ): Promise<Either<ResourceNotFoundError | UnexpectedError, CategoryType>> {
        return this.CategoryTypeRepository.getById(id);
    }
}
