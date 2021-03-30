import { Category, Either, Id, Maybe } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { UnexpectedError } from "../../../common/api/Errors";

export default interface CategoryRepository {
    getAll(): Promise<Category[]>;
    getById(id: Id): Promise<Maybe<Category>>;
    delete(id: Id): Promise<Either<UnexpectedError, ActionResult>>;
    save(entity: Category): Promise<Either<UnexpectedError, ActionResult>>;
}
