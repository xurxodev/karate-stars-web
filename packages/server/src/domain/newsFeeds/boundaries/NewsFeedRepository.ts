import { Id, Maybe, NewsFeed } from "karate-stars-core";

export default interface NewsFeedRepository {
    getAll(): Promise<NewsFeed[]>;
    getById(id: Id): Promise<Maybe<NewsFeed>>;
}
