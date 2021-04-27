import { Video, VideoData } from "karate-stars-core";
import { MongoConector } from "../../common/data/MongoConector";
import { MongoCollection } from "../../common/data/Types";
import MongoRepository from "../../common/data/MongoRepository";
import { renameProp } from "../../common/data/utils";
import VideoRepository from "../domain/boundaries/VideoRepository";

type VideoDB = Omit<VideoData, "id"> & MongoCollection;

export default class VideoMongoRepository
    extends MongoRepository<Video, VideoDB>
    implements VideoRepository {
    constructor(mongoConector: MongoConector) {
        super(mongoConector, "videos");
    }

    protected mapToDomain(modelDB: VideoDB): Video {
        return Video.create({
            id: modelDB._id,
            links: modelDB.links,
            title: modelDB.title,
            description: modelDB.description,
            subtitle: modelDB.subtitle,
            competitors: modelDB.competitors,
            eventDate: modelDB.eventDate,
            createdDate: modelDB.createdDate,
            order: modelDB.order,
        }).get();
    }

    protected mapToDB(entity: Video): VideoDB {
        const rawData = entity.toData();

        return renameProp("id", "_id", rawData) as VideoDB;
    }
}
