import { Id, Maybe, NewsFeed } from "karate-stars-core";
import { ActionResult } from "../usecases/DeleteNewsFeedUseCase";

export default interface NewsFeedRepository {
    getAll(): Promise<NewsFeed[]>;
    getById(id: Id): Promise<Maybe<NewsFeed>>;
    delete(id: Id): Promise<ActionResult>;
}
