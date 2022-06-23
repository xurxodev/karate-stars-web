import { MongoConector } from "../../common/data/MongoConector";
import { MongoCollection } from "../../common/data/Types";
import MongoRepository from "../../common/data/MongoRepository";
import { Ranking } from "../domain/entities/Ranking";
import RankingRepository from "../domain/boundaries/RankingRepository";

type RankingDB = Omit<Ranking, "id"> & MongoCollection;

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
        return {
            id: modelDB._id,
            name: modelDB.name,
            webUrl: modelDB.webUrl,
            apiUrl: modelDB.apiUrl,
            categoryParameter: modelDB.categoryParameter,
            categories: modelDB.categories,
        };
    }

    protected mapToDB(entity: Ranking): RankingDB {
        const rawData = { ...entity, _id: entity.id };

        return rawData;
    }
}
