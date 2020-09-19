import { MongoClient } from "mongodb";
import { SettingsDB } from "./SettingsDB";
import SettingsRepository from "../../domain/settings/boundaries/SettingsRepository";
import { Settings } from "../../domain/settings/entities/Settings";
import { Id } from "karate-stars-core";

export default class SettingsMongoRepository implements SettingsRepository {
    constructor(private mongodbConecction: string) {}

    async get(): Promise<Settings> {
        const mongoClient = new MongoClient(this.mongodbConecction, {
            useUnifiedTopology: true,
        });

        // Use connect method to connect to the Server
        await mongoClient.connect();

        const cursor = mongoClient.db().collection("settings").find<SettingsDB>();

        const settingsDB = (await cursor.toArray())[0];

        return this.mapToDomain(settingsDB);
    }

    private mapToDomain(settingsDB: SettingsDB): Settings {
        return {
            ...settingsDB,
            identifier: Id.createExisted(settingsDB._id).getOrThrow(),
        };
    }
}
