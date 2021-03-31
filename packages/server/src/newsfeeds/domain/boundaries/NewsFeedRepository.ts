import { Either, Id, NewsFeed } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";

export default interface NewsFeedRepository {
    getAll(): Promise<NewsFeed[]>;
    getById(id: Id): Promise<Either<ResourceNotFoundError | UnexpectedError, NewsFeed>>;
    delete(id: Id): Promise<Either<UnexpectedError, ActionResult>>;
    save(entity: NewsFeed): Promise<Either<UnexpectedError, ActionResult>>;
}
