import { Either, VideoData, Video, Id, VideoValidationTypes } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createResource, CreateResourceError } from "../../../common/domain/CreateResource";
import CompetitorRepository from "../../../competitors/domain/boundaries/CompetitorRepository";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import VideoRepository from "../boundaries/VideoRepository";
import { validateVideoDependencies } from "./utils";

export interface CreateResourceArgs extends AdminUseCaseArgs {
    data: VideoData;
}

export class CreateVideoUseCase extends AdminUseCase<
    CreateResourceArgs,
    CreateResourceError<VideoValidationTypes>,
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
        data,
    }: CreateResourceArgs): Promise<
        Either<CreateResourceError<VideoValidationTypes>, ActionResult>
    > {
        const createEntity = (data: VideoData) => Video.create(data);
        const getById = (id: Id) => this.videoRepository.getById(id);
        const saveEntity = (entity: Video) => this.videoRepository.save(entity);
        const validateDependencies = async (entity: Video) =>
            validateVideoDependencies(entity, this.competitorRepository);

        return createResource(data, createEntity, getById, saveEntity, validateDependencies);
    }
}
