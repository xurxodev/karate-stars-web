import { Either, Id, Maybe, CategoryType } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { UnexpectedError } from "../../../common/api/Errors";

export default interface CategoryTypeRepository {
    getAll(): Promise<CategoryType[]>;
    getById(id: Id): Promise<Maybe<CategoryType>>;
    delete(id: Id): Promise<Either<UnexpectedError, ActionResult>>;
    save(entity: CategoryType): Promise<Either<UnexpectedError, ActionResult>>;
}
