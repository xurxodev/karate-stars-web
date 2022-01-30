import { MongoConector } from "../../common/data/MongoConector";
import { MongoCollection } from "../../common/data/Types";
import MongoRepository from "../../common/data/MongoRepository";
import { CurrentNews } from "../domain/entities/CurrentNews";
import { Id } from "karate-stars-core";
import {
    CurrentNewsRepository,
    CurrentNewsWritableRepository,
} from "../domain/boundaries/CurrentNewsRepository";

type CurrentNewsDB = CurrentNews & MongoCollection & { createdDate: Date };

export default class CurrentNewsMongoRepository
    extends MongoRepository<CurrentNews, CurrentNewsDB>
    implements CurrentNewsWritableRepository, CurrentNewsRepository
{
    constructor(mongoConector: MongoConector) {
        super(mongoConector, "currentNews");
    }

    get(): Promise<CurrentNews[]> {
        return super.getAll();
    }

    protected mapToDomain(modelDB: CurrentNewsDB): CurrentNews {
        return {
            summary: {
                title: modelDB.summary.title,
                image: modelDB.summary.image,
                date: modelDB.summary.date,
                link: modelDB.summary.link,
            },
            source: {
                name: modelDB.source.name,
                image: modelDB.source.image,
                url: modelDB.source.url,
            },
        };
    }

    protected mapToDB(entity: CurrentNews): CurrentNewsDB {
        const rawData = { ...entity, _id: Id.generateId().value, createdDate: new Date() };

        return rawData;
    }
}
