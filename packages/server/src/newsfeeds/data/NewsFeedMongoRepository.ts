import { Either, Id, Maybe, NewsFeed, NewsFeedRawData } from "karate-stars-core";
import { MongoConector } from "../../common/data/MongoConector";
import { Collection } from "mongodb";
import { MongoCollection } from "../../common/data/Types";
import NewsFeedRepository from "../domain/boundaries/NewsFeedRepository";
import { UnexpectedError } from "../../common/api/Errors";
import { ActionResult } from "../../common/api/ActionResult";

type NewsFeedDB = Omit<NewsFeedRawData, "id"> & MongoCollection;

export default class NewsFeedMongoRepository implements NewsFeedRepository {
    constructor(private mongoConector: MongoConector) {}

    async getAll(): Promise<NewsFeed[]> {
        try {
            const collection = await this.collection();
            const cursor = collection.find<NewsFeedDB>({}, {});

            const newsFeeds = await cursor.toArray();

            return newsFeeds.map(feed => this.mapToDomain(feed));
        } catch (error) {
            console.log({ error });
            return [];
        }
    }

    async getById(id: Id): Promise<Maybe<NewsFeed>> {
        try {
            const collection = await this.collection();

            const newsFeedDB = await collection.findOne<NewsFeedDB>({ _id: id.value });

            return Maybe.fromValue(newsFeedDB).map(newsFeedDB => this.mapToDomain(newsFeedDB));
        } catch (error) {
            return Maybe.none();
        }
    }

    async delete(id: Id): Promise<Either<UnexpectedError, ActionResult>> {
        try {
            const collection = await this.collection();
            const response = await collection.deleteOne({ _id: id.value });

            return Either.right({
                ok: response.result.ok === 1,
                count: response.result.n || 0,
            });
        } catch (error) {
            return Either.left({ kind: "UnexpectedError", error });
        }
    }

    async save(newsFeed: NewsFeed): Promise<Either<UnexpectedError, ActionResult>> {
        try {
            const collection = await this.collection();

            const newsFeedDB = this.mapToDB(newsFeed);

            const _id = newsFeedDB._id;
            delete newsFeedDB._id;

            const response = await collection.updateOne(
                { _id },
                { $set: { ...newsFeedDB } },
                { upsert: true }
            );

            return Either.right({
                ok: response.result.ok === 1,
                count: response.result.ok === 1 ? 1 : 0,
            });
        } catch (error) {
            return Either.left({ kind: "UnexpectedError", error });
        }
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

    private mapToDB(newsFeed: NewsFeed): Partial<NewsFeedDB> {
        const rawData = newsFeed.toRawData();

        return this.renameProp("id", "_id", rawData) as NewsFeedDB;
    }

    private renameProp(oldProp: string, newProp: string, { [oldProp]: old, ...others }) {
        return {
            [newProp]: old,
            ...others,
        };
    }

    private async collection(): Promise<Collection> {
        const db = await this.mongoConector.db();

        return db.collection("newsFeeds");
    }
}
