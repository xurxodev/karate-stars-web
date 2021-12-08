import { MongoConector } from "../../common/data/MongoConector";
import { MongoCollection } from "../../common/data/Types";
import MongoRepository from "../../common/data/MongoRepository";
import { SocialNews } from "../domain/entities/SocialNews";
import { SocialNewsWritableRepository } from "../domain/boundaries/SocialNewsRepository";
import { Id } from "karate-stars-core";

type SocialNewsDB = SocialNews & MongoCollection & { createdDate: Date };

export default class SociaNewsMongoRepository
    extends MongoRepository<SocialNews, SocialNewsDB>
    implements SocialNewsWritableRepository {
    constructor(mongoConector: MongoConector) {
        super(mongoConector, "socialNews");
    }

    protected mapToDomain(modelDB: SocialNewsDB): SocialNews {
        return {
            summary: {
                title: modelDB.summary.title,
                image: modelDB.summary.image,
                video: modelDB.summary.video,
                date: modelDB.summary.date,
                link: modelDB.summary.link,
            },
            network: modelDB.network,
            user: {
                name: modelDB.user.name,
                image: modelDB.user.image,
                url: modelDB.user.url,
                userName: modelDB.user.userName,
            },
        };
    }

    protected mapToDB(entity: SocialNews): SocialNewsDB {
        const rawData = { ...entity, _id: Id.generateId().value, createdDate: new Date() };

        return rawData;
    }
}
