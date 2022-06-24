import { MongoConector } from "../../common/data/MongoConector";
import { MongoCollection } from "../../common/data/Types";
import MongoRepository from "../../common/data/MongoRepository";
import { Id, RankingEntry, RankingEntryData } from "karate-stars-core";
import RankingEntryReadableRepository, {
    RankingEntryWritableRepository,
} from "../domain/boundaries/RankingEntryRepository";
import { renameProp } from "../../common/data/utils";

type RankingEntryDB = RankingEntryData & MongoCollection & { createdDate: Date };

export default class RankingEntryMongoRepository
    extends MongoRepository<RankingEntry, RankingEntryDB>
    implements RankingEntryReadableRepository, RankingEntryWritableRepository
{
    constructor(mongoConector: MongoConector) {
        super(mongoConector, "rankingEntries");
    }

    async get(rankingId: Id, categoryId: Id): Promise<RankingEntry[]> {
        try {
            const collection = await this.collection();

            const cursor = collection.find<RankingEntryDB>({
                rankingId: rankingId.value,
                categoryId: categoryId.value,
            });

            const modelDBList = await cursor.toArray();

            cursor.close();

            return modelDBList.map(modelDB => this.mapToDomain(modelDB));
        } catch (error) {
            console.log({ error });
            return [];
        }
    }

    protected mapToDomain(modelDB: RankingEntryDB): RankingEntry {
        return RankingEntry.create({
            id: modelDB._id,
            rankingId: modelDB.rankingId,
            rank: modelDB.rank,
            country: modelDB.country,
            countryCode: modelDB.countryCode,
            name: modelDB.name,
            firstName: modelDB.firstName,
            lastName: modelDB.wkfId,
            wkfId: modelDB.wkfId,
            photo: modelDB.photo,
            totalPoints: modelDB.totalPoints,
            continentalCode: modelDB.continentalCode,
            categoryId: modelDB.categoryId,
            categoryWkfId: modelDB.categoryWkfId,
        }).get();
    }

    protected mapToDB(entity: RankingEntry): RankingEntryDB {
        const rawData = { ...entity.toData(), createdDate: new Date() };

        return renameProp("id", "_id", rawData) as RankingEntryDB;
    }
}
