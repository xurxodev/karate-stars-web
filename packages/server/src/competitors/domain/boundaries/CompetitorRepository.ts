import { Competitor, Either, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";

export default interface CompetitorRepository {
    getAll(): Promise<Competitor[]>;
    getById(id: Id): Promise<Either<ResourceNotFoundError | UnexpectedError, Competitor>>;
    delete(id: Id): Promise<Either<UnexpectedError, ActionResult>>;
    save(entity: Competitor): Promise<Either<UnexpectedError, ActionResult>>;
}
