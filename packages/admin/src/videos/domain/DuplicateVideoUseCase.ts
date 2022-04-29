import { VideoRepository } from "./Boundaries";
import { Either, Video } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";
import { createIdOrUnexpectedError } from "../../common/domain/utils";

export default class DuplicateVideoUseCase {
    constructor(private videoRepository: VideoRepository) {}

    async execute(id: string): Promise<Either<DataError, true>> {
        return await createIdOrUnexpectedError(id)
            .flatMap<Video>(id => this.videoRepository.getById(id))
            .flatMap<true>(video =>
                this.videoRepository.save(Video.create({ ...video.toData(), id: "" }).get())
            )
            .run();
    }
}
