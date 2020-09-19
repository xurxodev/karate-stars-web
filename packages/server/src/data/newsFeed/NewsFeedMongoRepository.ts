import { MongoClient } from "mongodb";
import { NewsFeed, NewsFeedRawData } from "karate-stars-core";
import NewsFeedRepository from "../../domain/newsFeeds/boundaries/NewsFeedRepository";
import { MongoCollection } from "../common/Types";

type NewsFeedDB = Omit<NewsFeedRawData, "id"> & MongoCollection;

export default class NewsFeedMongoRepository implements NewsFeedRepository {
    constructor(private mongodbConecction: string) {}

    async getAll(): Promise<NewsFeed[]> {
        const mongoClient = new MongoClient(this.mongodbConecction, {
            useUnifiedTopology: true,
        });

        await mongoClient.connect();

        const cursor = mongoClient.db().collection("newsFeeds").find<NewsFeedDB>();
        const newsFeeds = await cursor.toArray();

        return newsFeeds.map(feed => this.mapToDomain(feed));
    }

    private mapToDomain(newsFeed: NewsFeedDB): NewsFeed {
        return NewsFeed.create({
            id: newsFeed._id,
            name: newsFeed.name,
            language: newsFeed.language,
            type: newsFeed.type,
            image: newsFeed.image,
            url: newsFeed.url,
        }).get();
    }
}
