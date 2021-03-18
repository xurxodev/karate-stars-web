import { Either, Id, Maybe, EventType, EventTypeRawData } from "karate-stars-core";
import { MongoConector } from "../../common/data/MongoConector";
import { Collection } from "mongodb";
import { MongoCollection } from "../../common/data/Types";
import EventTypeRepository from "../domain/boundaries/EventTypeRepository";
import { UnexpectedError } from "../../common/api/Errors";
import { ActionResult } from "../../common/api/ActionResult";

type EventTypeDB = Omit<EventTypeRawData, "id"> & MongoCollection;

export default class EventTypeMongoRepository implements EventTypeRepository {
    constructor(private mongoConector: MongoConector) {}

    async getAll(): Promise<EventType[]> {
        try {
            const collection = await this.collection();

            const cursor = collection.find<EventTypeDB>({}, {});

            const EventTypes = await cursor.toArray();

            return EventTypes.map(feed => this.mapToDomain(feed));
        } catch (error) {
            console.log({ error });
            return [];
        }
    }

    async getById(id: Id): Promise<Maybe<EventType>> {
        try {
            const collection = await this.collection();

            const EventTypeDB = await collection.findOne<EventTypeDB>({ _id: id.value });

            return Maybe.fromValue(EventTypeDB).map(EventTypeDB => this.mapToDomain(EventTypeDB));
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

    async save(EventType: EventType): Promise<Either<UnexpectedError, ActionResult>> {
        try {
            const collection = await this.collection();

            const EventTypeDB = this.mapToDB(EventType);

            const _id = EventTypeDB._id;
            delete EventTypeDB._id;

            const response = await collection.updateOne(
                { _id },
                { $set: { ...EventTypeDB } },
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

    private mapToDomain(eventTypeDB: EventTypeDB): EventType {
        return EventType.create({
            id: eventTypeDB._id,
            name: eventTypeDB.name,
        }).get();
    }

    private mapToDB(EventType: EventType): Partial<EventTypeDB> {
        const rawData = EventType.toRawData();

        return this.renameProp("id", "_id", rawData) as EventTypeDB;
    }

    private renameProp(oldProp: string, newProp: string, { [oldProp]: old, ...others }) {
        return {
            [newProp]: old,
            ...others,
        };
    }

    private async collection(): Promise<Collection> {
        const db = await this.mongoConector.db();

        return db.collection("eventTypes");
    }
}
