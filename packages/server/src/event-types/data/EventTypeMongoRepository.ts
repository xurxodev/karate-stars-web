import { EventType, EventTypeData } from "karate-stars-core";
import { MongoConector } from "../../common/data/MongoConector";
import { MongoCollection } from "../../common/data/Types";
import EventTypeRepository from "../domain/boundaries/EventTypeRepository";
import MongoRepository from "../../common/data/MongoRepository";
import { renameProp } from "../../common/data/utils";

type EventTypeDB = Omit<EventTypeData, "id"> & MongoCollection;

export default class EventTypeMongoRepository
    extends MongoRepository<EventType, EventTypeDB>
    implements EventTypeRepository {
    constructor(mongoConector: MongoConector) {
        super(mongoConector, "eventTypes");
    }

    protected mapToDomain(eventTypeDB: EventTypeDB): EventType {
        return EventType.create({
            id: eventTypeDB._id,
            name: eventTypeDB.name,
        }).get();
    }

    protected mapToDB(EventType: EventType): EventTypeDB {
        const rawData = EventType.toData();

        return renameProp("id", "_id", rawData) as EventTypeDB;
    }
}
