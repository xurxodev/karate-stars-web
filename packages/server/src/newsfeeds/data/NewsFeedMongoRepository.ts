import { NewsFeed, NewsFeedData } from "karate-stars-core";
import { MongoConector } from "../../common/data/MongoConector";
import { MongoCollection } from "../../common/data/Types";
import NewsFeedRepository from "../domain/boundaries/NewsFeedRepository";
import MongoRepository from "../../common/data/MongoRepository";
import { renameProp } from "../../common/data/utils";

type NewsFeedDB = Omit<NewsFeedData, "id"> & MongoCollection;

export default class NewsFeedMongoRepository
    extends MongoRepository<NewsFeed, NewsFeedDB>
    implements NewsFeedRepository
{
    constructor(mongoConector: MongoConector) {
        super(mongoConector, "newsFeeds");
    }

    protected mapToDomain(modelDB: NewsFeedDB): NewsFeed {
        return NewsFeed.create({
            id: modelDB._id,
            name: modelDB.name,
            language: modelDB.language,
            type: modelDB.type,
            image: modelDB.image,
            url: modelDB.url,
        }).get();
    }

    protected mapToDB(entity: NewsFeed): NewsFeedDB {
        const rawData = entity.toData();

        return renameProp("id", "_id", rawData) as NewsFeedDB;
    }
}
