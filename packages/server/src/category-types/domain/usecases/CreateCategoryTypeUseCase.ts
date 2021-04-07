import { Either, CategoryTypeData, CategoryType, Id, ValidationError } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { CreateResourceUseCase } from "../../../common/domain/CreateResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import categoryTypeRepository from "../boundaries/CategoryTypeRepository";

export class CreateCategoryTypeUseCase extends CreateResourceUseCase<
    CategoryTypeData,
    CategoryType
> {
    constructor(
        private categoryTypeRepository: categoryTypeRepository,
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
        return this.categoryTypeRepository.getById(id);
    }

    protected saveEntity(entity: CategoryType): Promise<Either<UnexpectedError, ActionResult>> {
        return this.categoryTypeRepository.save(entity);
    }
}
