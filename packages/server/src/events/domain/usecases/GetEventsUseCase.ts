import { Either, EventData } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";

import EventRepository from "../boundaries/EventRepository";

export class GetEventsUseCase {
    constructor(private eventRepository: EventRepository) {}

    public async execute(): Promise<Either<UnexpectedError, EventData[]>> {
        const Events = await this.eventRepository.getAll();

        return Either.right(Events.map(entity => entity.toData()));
    }
}
