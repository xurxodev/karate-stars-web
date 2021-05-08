import { Competitor, Either, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ConflictError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { deleteResource, DeleteResourceError } from "../../../common/domain/DeleteResource";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import VideoRepository from "../../../videos/domain/boundaries/VideoRepository";
import CompetitorRepository from "../boundaries/CompetitorRepository";

export interface DeleteResourceArgs extends AdminUseCaseArgs {
    id: string;
}

export class DeleteCompetitorUseCase extends AdminUseCase<
    DeleteResourceArgs,
    DeleteResourceError,
    ActionResult
> {
    constructor(
        private competitorRepository: CompetitorRepository,
        private videoRepository: VideoRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({ id }: DeleteResourceArgs): Promise<Either<DeleteResourceError, ActionResult>> {
        const getById = (id: Id) => this.competitorRepository.getById(id);
        const deleteEntity = (id: Id) => this.competitorRepository.delete(id);
        const validateAsForeingKey = async (
            entity: Competitor
        ): Promise<Either<ConflictError, Competitor>> => {
            const usedAsForeingKey = (await this.videoRepository.getAll()).some(video =>
                video.competitors.some(id => id.value === entity.id.value)
            );

            return usedAsForeingKey
                ? Either.left({
                      kind: "ConflictError",
                      message: `Delete error competitor ${entity.id.value} is used in some videos`,
                  } as ConflictError)
                : Either.right(entity);
        };
        return deleteResource(id, getById, deleteEntity, validateAsForeingKey);
    }
}
