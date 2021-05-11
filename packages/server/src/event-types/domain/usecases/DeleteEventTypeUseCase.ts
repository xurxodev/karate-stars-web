import { Either, EventType, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ConflictError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { deleteResource, DeleteResourceError } from "../../../common/domain/DeleteResource";
import EventRepository from "../../../events/domain/boundaries/EventRepository";
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
    constructor(
        private eventTypeRepository: EventTypeRepository,
        private eventsRepository: EventRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({ id }: DeleteResourceArgs): Promise<Either<DeleteResourceError, ActionResult>> {
        const getById = (id: Id) => this.eventTypeRepository.getById(id);
        const deleteEntity = (id: Id) => this.eventTypeRepository.delete(id);
        const validateAsForeingKey = async (
            entity: EventType
        ): Promise<Either<ConflictError, EventType>> => {
            const usedAsForeingKey = (await this.eventsRepository.getAll()).some(event =>
                event.typeId.equals(entity.id)
            );

            return usedAsForeingKey
                ? Either.left({
                      kind: "ConflictError",
                      message: `Delete error eventType ${entity.id.value} is used in some events`,
                  } as ConflictError)
                : Either.right(entity);
        };

        return deleteResource(id, getById, deleteEntity, validateAsForeingKey);
    }
}
