import { VideoRepository } from "./Boundaries";
import { VideoData, Either } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class GetVideosUseCase {
    constructor(private videoRepository: VideoRepository) {}

    async execute(): Promise<Either<DataError, VideoData[]>> {
        const response = await this.videoRepository.getAll();

        return response.map(items => items.map(item => item.toData()));
    }
}
