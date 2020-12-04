import { Either, Id, NewsFeed } from "karate-stars-core";
import { DataError, ItemDataError } from "../../common/domain/Errors";

export interface NewsFeedRepository {
    getAll(search?: string): Promise<Either<DataError, NewsFeed[]>>;
    getById(id: Id): Promise<Either<ItemDataError, NewsFeed>>;
    deleteById(id: Id): Promise<Either<ItemDataError, true>>;
    save(newsFeed: NewsFeed): Promise<Either<DataError, true>>;
}
