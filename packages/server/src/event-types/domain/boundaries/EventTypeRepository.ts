import { Either, Id, EventType } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";

export default interface EventTypeRepository {
    getAll(): Promise<EventType[]>;
    getById(id: Id): Promise<Either<ResourceNotFoundError | UnexpectedError, EventType>>;
    delete(id: Id): Promise<Either<UnexpectedError, ActionResult>>;
    save(entity: EventType): Promise<Either<UnexpectedError, ActionResult>>;
}
