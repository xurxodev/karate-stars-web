import { Either, EventType, EventTypeData, Id, ValidationError } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { UpdateResourceUseCase } from "../../../common/domain/UpdateResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventTypeRepository from "../boundaries/EventTypeRepository";

export class UpdateEventTypeUseCase extends UpdateResourceUseCase<EventTypeData, EventType> {
    constructor(private eventRepository: EventTypeRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected createEntity(
        data: EventTypeData
    ): Either<ValidationError<EventTypeData>[], EventType> {
        return EventType.create(data);
    }

    protected getEntityById(
        id: Id
    ): Promise<Either<UnexpectedError | ResourceNotFoundError, EventType>> {
        return this.eventRepository.getById(id);
    }

    protected saveEntity(entity: EventType): Promise<Either<UnexpectedError, ActionResult>> {
        return this.eventRepository.save(entity);
    }

    protected updateEntity(
        data: EventTypeData,
        entity: EventType
    ): Either<ValidationError<EventTypeData>[], EventType> {
        return entity.update(data);
    }
}
