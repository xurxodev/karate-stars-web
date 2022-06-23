import { MongoConector } from "../../common/data/MongoConector";
import { MongoCollection } from "../../common/data/Types";
import MongoRepository from "../../common/data/MongoRepository";
import { Id } from "karate-stars-core";
import RankingEntryReadableRepository, {
    RankingEntryWritableRepository,
} from "../domain/boundaries/RankingEntryRepository";
import { RankingEntry } from "../domain/entities/RankingEntry";

type RankingEntryDB = RankingEntry & MongoCollection & { createdDate: Date };

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
        return {
            rankingId: modelDB.rankingId,
            rank: modelDB.rank,
            country: modelDB.country,
            countryCode: modelDB.countryCode,
            club: modelDB.club,
            name: modelDB.name,
            firstName: modelDB.firstName,
            lastName: modelDB.wkfId,
            wkfId: modelDB.wkfId,
            photo: modelDB.photo,
            totalPoints: modelDB.totalPoints,
            continentalCode: modelDB.continentalCode,
            categoryId: modelDB.categoryId,
            categoryWkfId: modelDB.categoryWkfId,
        };
    }

    protected mapToDB(entity: RankingEntry): RankingEntryDB {
        const rawData = { ...entity, _id: Id.generateId().value, createdDate: new Date() };

        return rawData;
    }
}
