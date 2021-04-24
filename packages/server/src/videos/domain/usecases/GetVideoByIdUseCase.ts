import { Either, VideoData } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import VideoRepository from "../boundaries/VideoRepository";

export interface GetVideoByIdArg extends AdminUseCaseArgs {
    id: string;
}

type GetVideoByIdError = ResourceNotFoundError | UnexpectedError;

export class GetVideoByIdUseCase extends AdminUseCase<
    GetVideoByIdArg,
    GetVideoByIdError,
    VideoData
> {
    constructor(private videoRepository: VideoRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run({ id }: GetVideoByIdArg): Promise<Either<GetVideoByIdError, VideoData>> {
        const result = await createIdOrResourceNotFound<GetVideoByIdError>(id)
            .flatMap(id => this.videoRepository.getById(id))
            .map(entity => entity.toData())
            .run();

        return result;
    }
}
