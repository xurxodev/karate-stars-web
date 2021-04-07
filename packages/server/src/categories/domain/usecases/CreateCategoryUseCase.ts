import { Either, CategoryData, Category, Id, ValidationError } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { CreateResourceUseCase } from "../../../common/domain/CreateResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CategoryRepository from "../boundaries/CategoryRepository";

export class CreateCategoryUseCase extends CreateResourceUseCase<CategoryData, Category> {
    constructor(private eventRepository: CategoryRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected createEntity(data: CategoryData): Either<ValidationError<CategoryData>[], Category> {
        return Category.create(data);
    }

    protected getEntityById(
        id: Id
    ): Promise<Either<UnexpectedError | ResourceNotFoundError, Category>> {
        return this.eventRepository.getById(id);
    }

    protected saveEntity(entity: Category): Promise<Either<UnexpectedError, ActionResult>> {
        return this.eventRepository.save(entity);
    }
}
