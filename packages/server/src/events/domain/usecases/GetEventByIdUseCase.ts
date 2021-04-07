import { Either, EventData, Event, Id } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { GetResourceByIdUseCase } from "../../../common/domain/GetResourceByIdUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventsRepository from "../boundaries/EventRepository";

export class GetEventByIdUseCase extends GetResourceByIdUseCase<EventData, Event> {
    constructor(private eventRepository: EventsRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected getEntityById(
        id: Id
    ): Promise<Either<ResourceNotFoundError | UnexpectedError, Event>> {
        return this.eventRepository.getById(id);
    }
}
