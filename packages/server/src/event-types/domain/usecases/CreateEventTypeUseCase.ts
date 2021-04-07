import { Either, EventType, EventTypeData, Id, ValidationError } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { CreateResourceUseCase } from "../../../common/domain/CreateResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventTypeRepository from "../boundaries/EventTypeRepository";

export class CreateEventTypeUseCase extends CreateResourceUseCase<EventTypeData, EventType> {
    constructor(private eventTypeRepository: EventTypeRepository, userRepository: UserRepository) {
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
        return this.eventTypeRepository.getById(id);
    }

    protected saveEntity(entity: EventType): Promise<Either<UnexpectedError, ActionResult>> {
        return this.eventTypeRepository.save(entity);
    }
}
