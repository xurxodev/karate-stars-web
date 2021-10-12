import SocialNewsRepository from "../domain/boundaries/SocialNewsRepository";
import { SocialNews } from "../domain/entities/SocialNews";
import SocialNewsTwitterDataSource from "./SocialNewsTwitterDataSource";
import SocialNewsInstagramDataSource from "./SocialNewsInstagramDataSource";

export default class SocialNewsWebRepository implements SocialNewsRepository {
    constructor(
        private twitterDataSource: SocialNewsTwitterDataSource,
        private instagramDataSource: SocialNewsInstagramDataSource
    ) {}

    public async get(search: string): Promise<SocialNews[]> {
        const twitterNews = await this.twitterDataSource.get(search);
        const instagramNews = await this.instagramDataSource.get();

        const news = [...twitterNews, ...instagramNews].sort(
            (a: SocialNews, b: SocialNews) =>
                Date.parse(b.summary.date) - Date.parse(a.summary.date)
        );

        return news;
    }
}
