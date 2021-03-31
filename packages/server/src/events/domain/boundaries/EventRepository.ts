import { Either, Id, Event } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";

export default interface EventRepository {
    getAll(): Promise<Event[]>;
    getById(id: Id): Promise<Either<ResourceNotFoundError | UnexpectedError, Event>>;
    delete(id: Id): Promise<Either<UnexpectedError, ActionResult>>;
    save(entity: Event): Promise<Either<UnexpectedError, ActionResult>>;
}
