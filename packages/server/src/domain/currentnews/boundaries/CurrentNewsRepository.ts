import { CurrentNews } from "../entities/CurrentNews";
import { NewsFeed } from "../../settings/entities/Settings";

export default interface CurrentNewsRepository {
    get(feeds: NewsFeed[]): Promise<CurrentNews[]>;
}
