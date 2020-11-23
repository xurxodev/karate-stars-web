import { Id, Maybe, NewsFeed, NewsFeedRawData } from "karate-stars-core";
import NewsFeedRepository from "../../domain/newsFeeds/boundaries/NewsFeedRepository";
import { MongoCollection } from "../common/Types";
import { MongoConector } from "../common/MongoConector";
import { ActionResult } from "../../domain/newsFeeds/usecases/DeleteNewsFeedUseCase";

type NewsFeedDB = Omit<NewsFeedRawData, "id"> & MongoCollection;

export default class NewsFeedMongoRepository implements NewsFeedRepository {
    constructor(private mongoConector: MongoConector) {}

    async getAll(): Promise<NewsFeed[]> {
        const db = await this.mongoConector.db();

        const cursor = db.collection("newsFeeds").find<NewsFeedDB>();
        const newsFeeds = await cursor.toArray();

        return newsFeeds.map(feed => this.mapToDomain(feed));
    }

    async getById(id: Id): Promise<Maybe<NewsFeed>> {
        const db = await this.mongoConector.db();

        const newsFeedDB = await db.collection("newsFeeds").findOne<NewsFeedDB>({ _id: id.value });

        return Maybe.fromValue(newsFeedDB).map(newsFeedDB => this.mapToDomain(newsFeedDB));
    }

    async delete(id: Id): Promise<ActionResult> {
        const db = await this.mongoConector.db();
        const response = await db.collection("newsFeeds").deleteOne({ _id: id.value });

        return {
            ok: response.result.ok === 1,
            count: response.result.n || 0,
        };
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
