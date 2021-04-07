import { Either, CategoryType, CategoryTypeData, Id, ValidationError } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { UpdateResourceUseCase } from "../../../common/domain/UpdateResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CategoryTypesRepository from "../boundaries/CategoryTypeRepository";

export class UpdateCategoryTypeUseCase extends UpdateResourceUseCase<
    CategoryTypeData,
    CategoryType
> {
    constructor(
        private CategoryTypeRepository: CategoryTypesRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected createEntity(
        data: CategoryTypeData
    ): Either<ValidationError<CategoryTypeData>[], CategoryType> {
        return CategoryType.create(data);
    }

    protected getEntityById(
        id: Id
    ): Promise<Either<UnexpectedError | ResourceNotFoundError, CategoryType>> {
        return this.CategoryTypeRepository.getById(id);
    }

    protected saveEntity(entity: CategoryType): Promise<Either<UnexpectedError, ActionResult>> {
        return this.CategoryTypeRepository.save(entity);
    }

    protected updateEntity(
        data: CategoryTypeData,
        entity: CategoryType
    ): Either<ValidationError<CategoryTypeData>[], CategoryType> {
        return entity.update(data);
    }
}
