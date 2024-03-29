import { Either, Id } from "karate-stars-core";
import { MongoConector } from "./MongoConector";
import { Collection } from "mongodb";
import { MongoCollection } from "./Types";
import { ResourceNotFoundError, UnexpectedError } from "../api/Errors";
import { ActionResult } from "../api/ActionResult";

export default abstract class MongoRepository<Entity, ModelDB extends MongoCollection> {
    constructor(private mongoConector: MongoConector, private collectionName: string) {}

    protected abstract mapToDomain(model: ModelDB): Entity;

    protected abstract mapToDB(entity: Entity): ModelDB;

    async getAll(): Promise<Entity[]> {
        try {
            const collection = await this.collection();
            const cursor = collection.find<ModelDB>({}, {});

            const modelDBList = await cursor.toArray();

            return modelDBList.map(feed => this.mapToDomain(feed));
        } catch (error) {
            console.log({ error });
            return [];
        }
    }

    async getById(id: Id): Promise<Either<ResourceNotFoundError | UnexpectedError, Entity>> {
        try {
            const collection = await this.collection();

            const modelDB = await collection.findOne<ModelDB>({ _id: id.value });

            if (modelDB) {
                return Either.right(this.mapToDomain(modelDB));
            } else {
                return Either.left({
                    kind: "ResourceNotFound",
                    message: `Id ${id.value} not found`,
                } as ResourceNotFoundError);
            }
        } catch (error) {
            return Either.left({ kind: "UnexpectedError", error });
        }
    }

    async delete(id: Id): Promise<Either<UnexpectedError, ActionResult>> {
        try {
            const collection = await this.collection();
            const response = await collection.deleteOne({ _id: id.value });

            return Either.right({
                ok: response.acknowledged,
                count: response.deletedCount || 0,
            });
        } catch (error) {
            return Either.left({ kind: "UnexpectedError", error });
        }
    }

    async save(entity: Entity): Promise<Either<UnexpectedError, ActionResult>> {
        try {
            const collection = await this.collection();

            const modelDB = this.mapToDB(entity);

            const _id = modelDB._id;
            //delete modelDB._id;

            const response = await collection.updateOne(
                { _id },
                { $set: { ...modelDB } },
                { upsert: true }
            );

            return Either.right({
                ok: response.acknowledged,
                count: response.modifiedCount,
            });
        } catch (error) {
            return Either.left({ kind: "UnexpectedError", error });
        }
    }

    // async replaceAll(entities: Entity[]): Promise<Either<UnexpectedError, ActionResult>> {
    //     try {
    //         const collection = await this.collection();

    //         const modelDBs = entities.map(entity => this.mapToDB(entity));

    //         await collection.deleteMany({});

    //         const response = await collection.insertMany(modelDBs);

    //         return Either.right({
    //             ok: response.acknowledged,
    //             count: response.insertedCount,
    //         });
    //     } catch (error) {
    //         return Either.left({ kind: "UnexpectedError", error });
    //     }
    // }

    async replaceAll(entities: Entity[]): Promise<Either<UnexpectedError, ActionResult>> {
        try {
            const collection = await this.collection();

            const modelDBs = entities.map(entity => this.mapToDB(entity));

            await collection.deleteMany({});

            const models = modelDBs.map(modelDB => modelDB as any);

            const results = await collection.insertMany(models);

            return Either.right({
                ok: true,
                count: results.insertedCount,
            });
        } catch (error) {
            console.log(JSON.stringify(error));
            return Either.left({ kind: "UnexpectedError", error });
        }
    }

    protected async collection(): Promise<Collection> {
        const db = await this.mongoConector.db();

        return db.collection(this.collectionName);
    }
}
