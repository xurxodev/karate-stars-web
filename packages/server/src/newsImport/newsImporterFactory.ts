import { MongoConector } from "../common/data/MongoConector";
import { CurrentNewsImporter } from "./importers/currentNewsImporter";
import { SocialNewsImporter } from "./importers/socialNewsImporter";
import { NewsImporter } from "./importNews";

const mongoConnection = process.env.MONGO_DB_CONNECTION;

if (!mongoConnection) {
    throw new Error("Does not exists environment variable for mongo database connection");
}

const mongoConector = new MongoConector(mongoConnection);

const strategies: Record<string, () => NewsImporter> = {
    current: () => new CurrentNewsImporter(mongoConector),
    social: () => new SocialNewsImporter(mongoConector),
};

export const newsImporterFactory = {
    createStrategies: (importerKeys: string[]) => {
        const finalStrategies = Object.keys(strategies)
            .filter(key => importerKeys.includes(key))
            .map(key => strategies[key]());

        return finalStrategies;
    },
};
