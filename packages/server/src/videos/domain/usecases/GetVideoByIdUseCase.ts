import { Either, VideoData } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import VideoRepository from "../boundaries/VideoRepository";

export interface GetVideoByIdArg {
    id: string;
}

type GetVideoByIdError = ResourceNotFoundError | UnexpectedError;

export class GetVideoByIdUseCase {
    constructor(private videoRepository: VideoRepository) {}

    public async execute({ id }: GetVideoByIdArg): Promise<Either<GetVideoByIdError, VideoData>> {
        const result = await createIdOrResourceNotFound<GetVideoByIdError>(id)
            .flatMap(id => this.videoRepository.getById(id))
            .map(entity => entity.toData())
            .run();

        return result;
    }
}
