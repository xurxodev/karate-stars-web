import { Db, MongoClient } from "mongodb";

export class MongoConector {
    mongoClient: MongoClient;

    constructor(private mongodbConecction: string) {
        this.mongoClient = new MongoClient(this.mongodbConecction, {
            useUnifiedTopology: true,
        });
    }

    async db(): Promise<Db> {
        if (!this.mongoClient.isConnected()) {
            await this.mongoClient.connect();
        }

        return this.mongoClient.db();
    }
}
