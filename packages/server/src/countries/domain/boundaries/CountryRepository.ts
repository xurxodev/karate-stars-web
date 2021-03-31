import { Country, Either, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";

export default interface CountryRepository {
    getAll(): Promise<Country[]>;
    getById(id: Id): Promise<Either<ResourceNotFoundError | UnexpectedError, Country>>;
    delete(id: Id): Promise<Either<UnexpectedError, ActionResult>>;
    save(entity: Country): Promise<Either<UnexpectedError, ActionResult>>;
}
