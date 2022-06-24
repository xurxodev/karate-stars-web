import { MongoConector } from "../../common/data/MongoConector";
import { MongoCollection } from "../../common/data/Types";
import MongoRepository from "../../common/data/MongoRepository";
import RankingRepository from "../domain/boundaries/RankingRepository";
import { Ranking, RankingData } from "karate-stars-core";
import { renameProp } from "../../common/data/utils";

type RankingDB = Omit<RankingData, "id"> & MongoCollection;

interface RankingFilters {
    toImport?: boolean;
}

export default class RankingMongoRepository
    extends MongoRepository<Ranking, RankingDB>
    implements RankingRepository
{
    constructor(mongoConector: MongoConector) {
        super(mongoConector, "rankings");
    }

    async get(filters: RankingFilters): Promise<Ranking[]> {
        const rankings = await super.getAll();

        return rankings.filter(
            ranking => !filters.toImport || (filters.toImport && ranking.apiUrl !== null)
        );
    }

    protected mapToDomain(modelDB: RankingDB): Ranking {
        return Ranking.create({
            id: modelDB._id,
            name: modelDB.name,
            webUrl: modelDB.webUrl,
            apiUrl: modelDB.apiUrl,
            categoryParameter: modelDB.categoryParameter,
            categories: modelDB.categories,
        }).get();
    }

    protected mapToDB(entity: Ranking): RankingDB {
        const rawData = entity.toData();

        return renameProp("id", "_id", rawData) as RankingDB;
    }
}
