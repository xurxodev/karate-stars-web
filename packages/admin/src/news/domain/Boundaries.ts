import { Either, Id, NewsFeed } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export interface NewsFeedRepository {
    getAll(): Promise<Either<DataError, NewsFeed[]>>;
    getById(id: Id): Promise<Either<DataError, NewsFeed>>;
    deleteById(id: Id): Promise<Either<DataError, true>>;
    save(newsFeed: NewsFeed): Promise<Either<DataError, true>>;
}
