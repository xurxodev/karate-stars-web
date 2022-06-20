import { Db } from "mongodb";

type OldEvent = {
    _id: string;
    name: string;
    typeId: string;
    year: number;
    url?: string;
};

type NewEvent = {
    _id: string;
    name: string;
    typeId: string;
    startDate: Date;
    endDate: Date;
    url?: string;
};

export async function up(db: Db) {
    const collection = db.collection("events");

    const cursor = collection.find<OldEvent>({}, {});

    const events: NewEvent[] = (await cursor.toArray()).map(event => ({
        _id: event._id,
        name: event.name,
        typeId: event.typeId,
        startDate: new Date(`${event.year}-11-25T00:00:00.000Z`),
        endDate: new Date(`${event.year}-11-25T00:00:00.000Z`),
    }));

    await collection.deleteMany({});

    await Promise.all(
        events.map(event =>
            collection.updateOne({ _id: event._id }, { $set: { ...event } }, { upsert: true })
        )
    );
}

export async function down(db: Db) {
    const collection = db.collection("events");

    const cursor = collection.find<NewEvent>({}, {});

    const events: OldEvent[] = (await cursor.toArray()).map(event => ({
        _id: event._id,
        name: event.name,
        typeId: event.typeId,
        year: event.startDate.getFullYear(),
    }));

    await collection.deleteMany({});

    await Promise.all(
        events.map(event =>
            collection.updateOne({ _id: event._id }, { $set: { ...event } }, { upsert: true })
        )
    );
}
