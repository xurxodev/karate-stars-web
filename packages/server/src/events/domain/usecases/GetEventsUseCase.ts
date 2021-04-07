import { EventData, Event } from "karate-stars-core";
import { GetResourcesUseCase } from "../../../common/domain/GetResourcesUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";

import EventsRepository from "../boundaries/EventRepository";

export class GetEventsUseCase extends GetResourcesUseCase<EventData, Event> {
    constructor(private eventRepository: EventsRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected getEntities(): Promise<Event[]> {
        return this.eventRepository.getAll();
    }
}
