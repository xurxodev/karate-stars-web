import { Country, Either, Id, Maybe } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { UnexpectedError } from "../../../common/api/Errors";

export default interface CountryRepository {
    getAll(): Promise<Country[]>;
    getById(id: Id): Promise<Maybe<Country>>;
    delete(id: Id): Promise<Either<UnexpectedError, ActionResult>>;
    save(entity: Country): Promise<Either<UnexpectedError, ActionResult>>;
}
