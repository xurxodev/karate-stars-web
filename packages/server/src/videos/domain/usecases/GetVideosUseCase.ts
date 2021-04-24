import { Either, VideoData } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";

import VideoRepository from "../boundaries/VideoRepository";

export class GetVideosUseCase extends AdminUseCase<AdminUseCaseArgs, UnexpectedError, VideoData[]> {
    constructor(private videoRepository: VideoRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run(_: AdminUseCaseArgs): Promise<Either<UnexpectedError, VideoData[]>> {
        const categories = await this.videoRepository.getAll();

        return Either.right(categories.map(entity => entity.toData()));
    }
}
