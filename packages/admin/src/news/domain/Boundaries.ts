import { GetNewsFeedsError } from "./Errors";
import { Either, NewsFeed } from "karate-stars-core";

export interface NewsFeedRepository {
    getAll(): Promise<Either<GetNewsFeedsError, NewsFeed[]>>;
}
