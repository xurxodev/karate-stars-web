import { Event, EventRawData } from "karate-stars-core";
import { MongoConector } from "../../common/data/MongoConector";
import { MongoCollection } from "../../common/data/Types";
import MongoRepository from "../../common/data/MongoRepository";
import { renameProp } from "../../common/data/utils";
import EventRepository from "../domain/boundaries/EventRepository";

type EventDB = Omit<EventRawData, "id"> & MongoCollection;

export default class EventMongoRepository
    extends MongoRepository<Event, EventDB>
    implements EventRepository {
    constructor(mongoConector: MongoConector) {
        super(mongoConector, "events");
    }

    protected mapToDomain(modelDB: EventDB): Event {
        return Event.create({
            id: modelDB._id,
            name: modelDB.name,
            year: modelDB.year,
            typeId: modelDB.typeId,
        }).get();
    }

    protected mapToDB(entity: Event): EventDB {
        const rawData = entity.toRawData();

        return renameProp("id", "_id", rawData) as EventDB;
    }
}
