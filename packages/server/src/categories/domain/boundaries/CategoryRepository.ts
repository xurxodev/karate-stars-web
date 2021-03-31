import { Category, Either, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";

export default interface CategoryRepository {
    getAll(): Promise<Category[]>;
    getById(id: Id): Promise<Either<ResourceNotFoundError | UnexpectedError, Category>>;
    delete(id: Id): Promise<Either<UnexpectedError, ActionResult>>;
    save(entity: Category): Promise<Either<UnexpectedError, ActionResult>>;
}
