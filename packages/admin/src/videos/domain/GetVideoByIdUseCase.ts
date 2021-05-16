import { VideoRepository } from "./Boundaries";
import { Video, VideoData, Either } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";
import { createIdOrUnexpectedError } from "../../common/domain/utils";

export default class GetVideoByIdUseCase {
    constructor(private videoRepository: VideoRepository) {}

    async execute(id: string): Promise<Either<DataError, VideoData>> {
        return await createIdOrUnexpectedError(id)
            .flatMap<Video>(id => this.videoRepository.getById(id))
            .map(newsFeed => newsFeed.toData())
            .run();
    }
}
