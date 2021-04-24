import { Either, VideoData, Video, Id, VideoValidationTypes } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { updateResource, UpdateResourceError } from "../../../common/domain/UpdateResource";
import CompetitorRepository from "../../../competitors/domain/boundaries/CompetitorRepository";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import VideoRepository from "../boundaries/VideoRepository";
import { validateVideoDependencies } from "./utils";

export interface UpdateResourceArgs extends AdminUseCaseArgs {
    id: string;
    data: VideoData;
}

export class UpdateVideoUseCase extends AdminUseCase<
    UpdateResourceArgs,
    UpdateResourceError<VideoValidationTypes>,
    ActionResult
> {
    constructor(
        private videoRepository: VideoRepository,
        private competitorRepository: CompetitorRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({
        id,
        data,
    }: UpdateResourceArgs): Promise<
        Either<UpdateResourceError<VideoValidationTypes>, ActionResult>
    > {
        const updateEntity = (data: VideoData, entity: Video) => entity.update(data);
        const getById = (id: Id) => this.videoRepository.getById(id);
        const saveEntity = (entity: Video) => this.videoRepository.save(entity);
        const validateDependencies = async (entity: Video) =>
            validateVideoDependencies(entity, this.competitorRepository);

        return updateResource(id, data, getById, updateEntity, saveEntity, validateDependencies);
    }
}
