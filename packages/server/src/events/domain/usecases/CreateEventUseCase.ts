import { Either, Event, EventData, Id, ValidationError } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { CreateResourceUseCase } from "../../../common/domain/CreateResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventRepository from "../boundaries/EventRepository";

export class CreateEventUseCase extends CreateResourceUseCase<EventData, Event> {
    constructor(private eventRepository: EventRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected createEntity(data: EventData): Either<ValidationError<EventData>[], Event> {
        return Event.create(data);
    }

    protected getEntityById(
        id: Id
    ): Promise<Either<UnexpectedError | ResourceNotFoundError, Event>> {
        return this.eventRepository.getById(id);
    }

    protected saveEntity(entity: Event): Promise<Either<UnexpectedError, ActionResult>> {
        return this.eventRepository.save(entity);
    }
}
