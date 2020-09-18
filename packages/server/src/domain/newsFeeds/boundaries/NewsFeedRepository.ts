import { NewsFeed } from "karate-stars-core";

export default interface NewsFeedRepository {
    getAll(): Promise<NewsFeed[]>;
}
