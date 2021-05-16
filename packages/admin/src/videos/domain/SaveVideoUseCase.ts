import { VideoRepository } from "./Boundaries";
import { Either, Video } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class SaveVideoUseCase {
    constructor(private videoRepository: VideoRepository) {}

    async execute(entity: Video): Promise<Either<DataError, true>> {
        return this.videoRepository.save(entity);
    }
}
