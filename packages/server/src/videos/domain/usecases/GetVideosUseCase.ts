import { Either, VideoData } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";

import VideoRepository from "../boundaries/VideoRepository";

export class GetVideosUseCase {
    constructor(private videoRepository: VideoRepository) {}

    public async run(): Promise<Either<UnexpectedError, VideoData[]>> {
        const categories = await this.videoRepository.getAll();

        return Either.right(categories.map(entity => entity.toData()));
    }
}
