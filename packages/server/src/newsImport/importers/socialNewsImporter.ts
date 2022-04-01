import { Either } from "karate-stars-core";
import { ActionResult } from "../../common/api/ActionResult";
import { UnexpectedError } from "../../common/api/Errors";
import { MongoConector } from "../../common/data/MongoConector";
import SettingsMongoRepository from "../../settings/data/SettingsMongoRepository";
import SociaNewsMongoRepository from "../../socialnews/data/SocialNewsMongoRepository";
import { SocialNews } from "../../socialnews/domain/entities/SocialNews";
import SocialNewsInstagramDirectDataSource from "../dataSources/SocialNewsInstagramDirectDataSource";
import SocialNewsInstagramDataSource from "../dataSources/SocialNewsInstagramDataSource";
import SocialNewsTwitterDataSource from "../dataSources/SocialNewsTwitterDataSource";
import { NewsImporter } from "../importNews";

export default interface SocialNewsDataSource {
    get(hastag: string): Promise<SocialNews[]>;
}

export class SocialNewsImporter implements NewsImporter {
    socialNetworkToImport: string[] = [];

    constructor(private mongoConector: MongoConector) {
        this.socialNetworkToImport = process.env.IMPORT_SOCIAL_NETWORKS?.split(",") ?? [];
    }

    socialMediasFactory: Record<string, () => SocialNewsDataSource> = {
        instagram: this.getInstagramDataSource,
        twitter: this.getTwitterDataSource,
    };

    async execute() {
        try {
            console.log(`Initializing social news importer`);

            const settingsRepository = new SettingsMongoRepository(this.mongoConector);

            const settings = await settingsRepository.get();

            const news = (
                await Promise.all(
                    this.socialNetworkToImport.map(socialMedia => {
                        const dataSource = this.socialMediasFactory[socialMedia]();

                        return dataSource.get(settings.socialNews.search);
                    })
                )
            ).flat();

            console.log(`Total social news ${news.length}`);

            const orderedNews = news.sort(
                (a: SocialNews, b: SocialNews) =>
                    Date.parse(b.summary.date) - Date.parse(a.summary.date)
            );

            const result = await this.saveSocialNews(orderedNews);

            result.fold(
                error => {
                    console.log(`Import social news failed: \n "${error}`);
                },
                () => {
                    console.log("Import social news finished successfully!!");
                }
            );
        } catch (error) {
            console.log(`An error has ocurred importing social news` + error);
        }
    }

    private getTwitterDataSource(): SocialNewsDataSource {
        const consumerkey = process.env.TWITTER_CONSUMER_KEY_PROP || "";
        const consumer_secret = process.env.TWITTER_CONSUMER_SECRET_PROP || "";

        if (!consumerkey || !consumer_secret) {
            throw new Error("Does not exists environment variables for twitter API");
        }

        return new SocialNewsTwitterDataSource(consumerkey, consumer_secret);
    }

    private getInstagramDataSource(): SocialNewsDataSource {
        //return new SocialNewsInstagramDataSource();
        return new SocialNewsInstagramDirectDataSource();
    }

    private async saveSocialNews(
        socialNews: SocialNews[]
    ): Promise<Either<UnexpectedError, ActionResult>> {
        const sociaNewsMongoRepository = new SociaNewsMongoRepository(this.mongoConector);

        return await sociaNewsMongoRepository.replaceAll(socialNews);
    }
}
