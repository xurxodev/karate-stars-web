import { GetNewsFeedsError } from "./Errors";
import { Either, NewsFeed } from "karate-stars-core";

export interface NewsFeedRepository {
    getAll(search?: string): Promise<Either<GetNewsFeedsError, NewsFeed[]>>;
}
