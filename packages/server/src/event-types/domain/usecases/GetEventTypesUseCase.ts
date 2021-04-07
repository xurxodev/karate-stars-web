import { EventType, EventTypeData } from "karate-stars-core";
import { GetResourcesUseCase } from "../../../common/domain/GetResourcesUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";

import EventTypeRepository from "../boundaries/EventTypeRepository";

export class GetEventTypesUseCase extends GetResourcesUseCase<EventTypeData, EventType> {
    constructor(private eventTypeRepository: EventTypeRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected getEntities(): Promise<EventType[]> {
        return this.eventTypeRepository.getAll();
    }
}
