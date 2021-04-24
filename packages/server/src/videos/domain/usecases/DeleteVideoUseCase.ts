import { Either, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { deleteResource, DeleteResourceError } from "../../../common/domain/DeleteResource";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import VideoRepository from "../boundaries/VideoRepository";

export interface DeleteResourceArgs extends AdminUseCaseArgs {
    id: string;
}

export class DeleteVideoUseCase extends AdminUseCase<
    DeleteResourceArgs,
    DeleteResourceError,
    ActionResult
> {
    constructor(private videoRepository: VideoRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected run({ id }: DeleteResourceArgs): Promise<Either<DeleteResourceError, ActionResult>> {
        const getById = (id: Id) => this.videoRepository.getById(id);
        const deleteEntity = (id: Id) => this.videoRepository.delete(id);

        return deleteResource(id, getById, deleteEntity);
    }
}
