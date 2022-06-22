import { MongoConector } from "../common/data/MongoConector";
import { RankingImporter } from "./importers/RankingImporter";

async function execute() {
    const mongoConnection = process.env.MONGO_DB_CONNECTION;

    if (!mongoConnection) {
        throw new Error("Does not exists environment variable for mongo database connection");
    }

    const mongoConector = new MongoConector(mongoConnection);

    const rankingImporter = new RankingImporter(mongoConector);

    await rankingImporter.execute();

    console.log("Import ranking entries finished successfully!!");
    process.exit();
}

execute();
