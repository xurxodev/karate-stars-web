import { MongoConector } from "./common/data/MongoConector";
import SocialNewsInstagramDataSource from "./socialnews/data/SocialNewsInstagramDataSource";
import SociaNewsMongoRepository from "./socialnews/data/SocialNewsMongoRepository";

async function execute() {
    const mongoConnection = process.env.MONGO_DB_CONNECTION;

    if (!mongoConnection) {
        throw new Error("Does not exists environment variable for mongo data base connection");
    }

    const mongoConector = new MongoConector(mongoConnection);

    const instagramProvider = new SocialNewsInstagramDataSource();
    const sociaNewsMongoRepository = new SociaNewsMongoRepository(mongoConector);

    const instagramSocialNews = await instagramProvider.get();

    const result = await sociaNewsMongoRepository.replaceAll(instagramSocialNews);

    result.fold(
        error => {
            console.log(`Import failed: \n "${error}`);
            process.exit();
        },
        () => {
            console.log("Import finished successfully!!");
            process.exit();
        }
    );
}

execute();
