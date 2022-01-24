import { Either, NewsFeed } from "karate-stars-core";
import { ActionResult } from "../../common/api/ActionResult";
import { UnexpectedError } from "../../common/api/Errors";
import { MongoConector } from "../../common/data/MongoConector";
import CurrentNewsMongoRepository from "../../currentnews/data/CurrentNewsMongoRepository";
import { CurrentNews } from "../../currentnews/domain/entities/CurrentNews";
import NewsFeedMongoRepository from "../../newsfeeds/data/NewsFeedMongoRepository";
import CurrentNewsRSSDataSource from "../dataSources/CurrentNewsRSSDataSource";
import { NewsImporter } from "../importNews";

export default interface CurrentNewsDataSource {
    get(feeds: NewsFeed[]): Promise<CurrentNews[]>;
}

export class CurrentNewsImporter implements NewsImporter {
    constructor(private mongoConector: MongoConector) {}

    async execute() {
        try {
            console.log(`Initializing current news importer`);
            const newsFeedRepository = new NewsFeedMongoRepository(this.mongoConector);
            const currentNewsRSSDataSource = new CurrentNewsRSSDataSource();

            const feeds = await newsFeedRepository.getAll();

            const news = await currentNewsRSSDataSource.get(feeds);

            console.log(`Total current news ${news.length}`);

            const orderedNews = news.sort(
                (a: CurrentNews, b: CurrentNews) =>
                    Date.parse(b.summary.date) - Date.parse(a.summary.date)
            );

            const result = await this.saveCurrentNews(orderedNews);

            result.fold(
                error => {
                    console.log(`Import current news failed: \n "${error}`);
                },
                () => {
                    console.log("Import current news finished successfully!!");
                }
            );
        } catch (error) {
            console.log(`An error has ocurred importing current news` + error);
        }
    }

    private async saveCurrentNews(
        currentNews: CurrentNews[]
    ): Promise<Either<UnexpectedError, ActionResult>> {
        const currentNewsMongoRepository = new CurrentNewsMongoRepository(this.mongoConector);

        return await currentNewsMongoRepository.replaceAll(currentNews);
    }
}
