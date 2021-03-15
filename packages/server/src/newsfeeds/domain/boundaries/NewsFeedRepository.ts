import { Either, Id, Maybe, NewsFeed } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { UnexpectedError } from "../../../common/api/Errors";

export default interface NewsFeedRepository {
    getAll(): Promise<NewsFeed[]>;
    getById(id: Id): Promise<Maybe<NewsFeed>>;
    delete(id: Id): Promise<Either<UnexpectedError, ActionResult>>;
    save(entity: NewsFeed): Promise<Either<UnexpectedError, ActionResult>>;
}
