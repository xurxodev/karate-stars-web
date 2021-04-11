import { Either, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { deleteResource, DeleteResourceError } from "../../../common/domain/DeleteResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventTypeRepository from "../boundaries/EventTypeRepository";

export interface DeleteResourceArgs extends AdminUseCaseArgs {
    id: string;
}

export class DeleteEventTypeUseCase extends AdminUseCase<
    DeleteResourceArgs,
    DeleteResourceError,
    ActionResult
> {
    constructor(private EventTypeRepository: EventTypeRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected run({ id }: DeleteResourceArgs): Promise<Either<DeleteResourceError, ActionResult>> {
        const getById = (id: Id) => this.EventTypeRepository.getById(id);
        const deleteEntity = (id: Id) => this.EventTypeRepository.delete(id);

        return deleteResource(id, getById, deleteEntity);
    }
}
