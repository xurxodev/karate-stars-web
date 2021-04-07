import { Either, Event, EventData, Id, ValidationError } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { UpdateResourceUseCase } from "../../../common/domain/UpdateResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventsRepository from "../boundaries/EventRepository";

export class UpdateEventUseCase extends UpdateResourceUseCase<EventData, Event> {
    constructor(private eventRepository: EventsRepository, userRepository: UserRepository) {
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

    protected updateEntity(
        data: EventData,
        entity: Event
    ): Either<ValidationError<EventData>[], Event> {
        return entity.update(data);
    }
}
