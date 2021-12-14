import { Either } from "karate-stars-core";
import { ActionResult } from "./common/api/ActionResult";
import { UnexpectedError } from "./common/api/Errors";
import { MongoConector } from "./common/data/MongoConector";
import SettingsMongoRepository from "./settings/data/SettingsMongoRepository";
import SocialNewsDataSource from "./socialnews/data/SocialNewsDataSource";
import SocialNewsInstagramDataSource from "./socialnews/data/SocialNewsInstagramDataSource";
import SociaNewsMongoRepository from "./socialnews/data/SocialNewsMongoRepository";
import SocialNewsTwitterDataSource from "./socialnews/data/SocialNewsTwitterDataSource";
import { SocialNews } from "./socialnews/domain/entities/SocialNews";

const mongoConnection = process.env.MONGO_DB_CONNECTION;

if (!mongoConnection) {
    throw new Error("Does not exists environment variable for mongo database connection");
}

const mongoConector = new MongoConector(mongoConnection);

const envSocialMedias = (process.env.SOCIAL_MEDIAS || "").split(",");

const socialMediasFactory: Record<string, () => SocialNewsDataSource> = {
    instagram: getInstagramDataSource,
    twitter: getTwitterDataSource,
};

async function execute() {
    const settingsRepository = new SettingsMongoRepository(mongoConector);

    const settings = await settingsRepository.get();

    const news = (
        await Promise.all(
            envSocialMedias.map(socialMedia => {
                const dataSource = socialMediasFactory[socialMedia]();

                return dataSource.get(settings.socialNews.search);
            })
        )
    ).flat();

    const orderedNews = news.sort(
        (a: SocialNews, b: SocialNews) => Date.parse(b.summary.date) - Date.parse(a.summary.date)
    );

    const result = await saveSocialNews(orderedNews);

    result.fold(
        error => {
            console.log(`Import news failed: \n "${error}`);
            process.exit();
        },
        () => {
            console.log("Import news finished successfully!!");
            process.exit();
        }
    );
}

function getTwitterDataSource(): SocialNewsDataSource {
    const consumerkey = process.env.TWITTER_CONSUMER_KEY_PROP || "";
    const consumer_secret = process.env.TWITTER_CONSUMER_SECRET_PROP || "";

    if (!consumerkey || !consumer_secret) {
        throw new Error("Does not exists environment variables for twitter API");
    }

    return new SocialNewsTwitterDataSource(consumerkey, consumer_secret);
}

function getInstagramDataSource(): SocialNewsDataSource {
    return new SocialNewsInstagramDataSource();
}

async function saveSocialNews(
    socialNews: SocialNews[]
): Promise<Either<UnexpectedError, ActionResult>> {
    const sociaNewsMongoRepository = new SociaNewsMongoRepository(mongoConector);

    return await sociaNewsMongoRepository.replaceAll(socialNews);
}

execute();
