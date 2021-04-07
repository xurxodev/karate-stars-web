import { Either, Event, EventData, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { DeleteResourceUseCase } from "../../../common/domain/DeleteResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventRepository from "../boundaries/EventRepository";

export class DeleteEventUseCase extends DeleteResourceUseCase<EventData, Event> {
    constructor(private eventRepository: EventRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected getEntityById(
        id: Id
    ): Promise<Either<UnexpectedError | ResourceNotFoundError, Event>> {
        return this.eventRepository.getById(id);
    }

    protected deleteEntity(id: Id): Promise<Either<UnexpectedError, ActionResult>> {
        return this.eventRepository.delete(id);
    }
}
