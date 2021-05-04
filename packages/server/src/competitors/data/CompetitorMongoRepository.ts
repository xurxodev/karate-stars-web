import { Competitor, CompetitorData } from "karate-stars-core";
import { MongoConector } from "../../common/data/MongoConector";
import { MongoCollection } from "../../common/data/Types";
import MongoRepository from "../../common/data/MongoRepository";
import { renameProp } from "../../common/data/utils";
import CompetitorRepository from "../domain/boundaries/CompetitorRepository";

type CompetitorDB = Omit<CompetitorData, "id"> & MongoCollection;

export default class CompetitorMongoRepository
    extends MongoRepository<Competitor, CompetitorDB>
    implements CompetitorRepository {
    constructor(mongoConector: MongoConector) {
        super(mongoConector, "competitors");
    }

    protected mapToDomain(modelDB: CompetitorDB): Competitor {
        return Competitor.create({
            id: modelDB._id,
            firstName: modelDB.firstName,
            lastName: modelDB.lastName,
            wkfId: modelDB.wkfId,
            biography: modelDB.biography,
            countryId: modelDB.countryId,
            categoryId: modelDB.categoryId,
            mainImage: modelDB.mainImage,
            isActive: modelDB.isActive,
            isLegend: modelDB.isLegend,
            links: modelDB.links,
            achievements: modelDB.achievements,
        }).get();
    }

    protected mapToDB(entity: Competitor): CompetitorDB {
        const rawData = entity.toData();

        return renameProp("id", "_id", rawData) as CompetitorDB;
    }
}
