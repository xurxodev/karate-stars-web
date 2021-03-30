import { Competitor, Either, Id, Maybe } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { UnexpectedError } from "../../../common/api/Errors";

export default interface CompetitorRepository {
    getAll(): Promise<Competitor[]>;
    getById(id: Id): Promise<Maybe<Competitor>>;
    delete(id: Id): Promise<Either<UnexpectedError, ActionResult>>;
    save(entity: Competitor): Promise<Either<UnexpectedError, ActionResult>>;
}
