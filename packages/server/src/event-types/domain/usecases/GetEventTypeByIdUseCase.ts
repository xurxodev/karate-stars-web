import { Either, EventTypeData, EventType, Id } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { GetResourceByIdUseCase } from "../../../common/domain/GetResourceByIdUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventTypesRepository from "../boundaries/EventTypeRepository";

export class GetEventTypeByIdUseCase extends GetResourceByIdUseCase<EventTypeData, EventType> {
    constructor(private eventTypeRepository: EventTypesRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected getEntityById(
        id: Id
    ): Promise<Either<ResourceNotFoundError | UnexpectedError, EventType>> {
        return this.eventTypeRepository.getById(id);
    }
}
