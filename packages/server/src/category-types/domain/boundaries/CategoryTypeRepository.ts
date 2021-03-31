import { Either, Id, CategoryType } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";

export default interface CategoryTypeRepository {
    getAll(): Promise<CategoryType[]>;
    getById(id: Id): Promise<Either<ResourceNotFoundError | UnexpectedError, CategoryType>>;
    delete(id: Id): Promise<Either<UnexpectedError, ActionResult>>;
    save(entity: CategoryType): Promise<Either<UnexpectedError, ActionResult>>;
}
