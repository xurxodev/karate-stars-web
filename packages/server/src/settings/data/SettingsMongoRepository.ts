import { SettingsDB } from "./SettingsDB";
import SettingsRepository from "../domain/boundaries/SettingsRepository";
import { Id } from "karate-stars-core";
import { MongoConector } from "../../common/data/MongoConector";
import { Settings } from "../domain/entities/Settings";

export default class SettingsMongoRepository implements SettingsRepository {
    constructor(private mongoConector: MongoConector) {}

    async get(): Promise<Settings> {
        const db = await this.mongoConector.db();

        const cursor = db.collection("settings").find<SettingsDB>({}, {});

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
