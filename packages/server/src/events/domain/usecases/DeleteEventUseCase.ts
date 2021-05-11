import { Either, Id, Event } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ConflictError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { deleteResource, DeleteResourceError } from "../../../common/domain/DeleteResource";
import CompetitorRepository from "../../../competitors/domain/boundaries/CompetitorRepository";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventRepository from "../boundaries/EventRepository";

export interface DeleteResourceArgs extends AdminUseCaseArgs {
    id: string;
}

export class DeleteEventUseCase extends AdminUseCase<
    DeleteResourceArgs,
    DeleteResourceError,
    ActionResult
> {
    constructor(
        private eventRepository: EventRepository,
        private competitorsRepository: CompetitorRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({ id }: DeleteResourceArgs): Promise<Either<DeleteResourceError, ActionResult>> {
        const getById = (id: Id) => this.eventRepository.getById(id);
        const deleteEntity = (id: Id) => this.eventRepository.delete(id);
        const validateAsForeingKey = async (
            entity: Event
        ): Promise<Either<ConflictError, Event>> => {
            const usedAsForeingKey = (await this.competitorsRepository.getAll()).some(competitor =>
                competitor.achievements.some(achievement => achievement.eventId.equals(entity.id))
            );

            return usedAsForeingKey
                ? Either.left({
                      kind: "ConflictError",
                      message: `Delete error event ${entity.id.value} is used in some competitors`,
                  } as ConflictError)
                : Either.right(entity);
        };

        return deleteResource(id, getById, deleteEntity, validateAsForeingKey);
    }
}
