import { MongoClient } from "mongodb";
import { Id } from "../../../core/build";

async function migrate() {
    // Create a new MongoClient
    const mongoClient = new MongoClient(
        "mongodb+srv://karatestars:ycLiHpMmCVXNMsvq@cluster0-4sdk2.mongodb.net/karateStarsDB?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true",
        { useUnifiedTopology: true }
    );

    // Use connect method to connect to the Server
    const client = await mongoClient.connect();

    const db = client.db();

    const collection = db.collection("competitors");
    const cursor = collection.find({}, {});

    const competitors = await cursor.toArray();

    for (const competitor of competitors) {
        const _id = competitor._id;

        const updatedCompetitor = {
            ...competitor,
            links: competitor.links.map(link => {
                return {
                    id: Id.generateId().value,
                    slug: link.url.split("/").pop(),
                    type: link.type,
                };
            }),
            achievements: competitor.achievements.map(achievement => {
                return {
                    id: Id.generateId().value,
                    eventId: achievement.eventId,
                    categoryId: achievement.categoryId,
                    position: achievement.position,
                };
            }),
        };

        const response = await collection.updateOne(
            { _id },
            { $set: { ...updatedCompetitor } },
            { upsert: true }
        );

        console.log(response.result);
    }
}

migrate();
