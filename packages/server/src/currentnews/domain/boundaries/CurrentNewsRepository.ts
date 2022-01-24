import { Either, NewsFeed } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { UnexpectedError } from "../../../common/api/Errors";
import { CurrentNews } from "../entities/CurrentNews";

export interface CurrentNewsRepository {
    get(feeds: NewsFeed[]): Promise<CurrentNews[]>;
}

export interface CurrentNewsWritableRepository<> {
    replaceAll(entities: CurrentNews[]): Promise<Either<UnexpectedError, ActionResult>>;
}
