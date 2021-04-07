import { Either, CategoryType, CategoryTypeData, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { DeleteResourceUseCase } from "../../../common/domain/DeleteResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CategoryTypeRepository from "../boundaries/CategoryTypeRepository";

export class DeleteCategoryTypeUseCase extends DeleteResourceUseCase<
    CategoryTypeData,
    CategoryType
> {
    constructor(
        private CategoryTypeRepository: CategoryTypeRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected getEntityById(
        id: Id
    ): Promise<Either<UnexpectedError | ResourceNotFoundError, CategoryType>> {
        return this.CategoryTypeRepository.getById(id);
    }

    protected deleteEntity(id: Id): Promise<Either<UnexpectedError, ActionResult>> {
        return this.CategoryTypeRepository.delete(id);
    }
}
