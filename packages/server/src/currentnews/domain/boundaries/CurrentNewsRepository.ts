import { NewsFeed } from "karate-stars-core";
import { CurrentNews } from "../entities/CurrentNews";

export default interface CurrentNewsRepository {
    get(feeds: NewsFeed[]): Promise<CurrentNews[]>;
}
