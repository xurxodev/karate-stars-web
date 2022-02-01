import { Db, MongoClient } from "mongodb";

export class MongoConector {
    mongoClient: MongoClient;
    cachedDB: Db | null = null;

    constructor(private mongodbConecction: string) {
        this.mongoClient = new MongoClient(this.mongodbConecction);
    }

    async db(): Promise<Db> {
        if (!this.cachedDB) {
            await this.mongoClient.connect();
        }

        this.cachedDB = this.mongoClient.db();

        return this.cachedDB;
    }
}
