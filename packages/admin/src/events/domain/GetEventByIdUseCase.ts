import { EventRepository } from "./Boundaries";
import { Event, EventData, Either } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";
import { createIdOrUnexpectedError } from "../../common/domain/utils";

export default class GetEventByIdUseCase {
    constructor(private eventRepository: EventRepository) {}

    async execute(id: string): Promise<Either<DataError, EventData>> {
        return await createIdOrUnexpectedError(id)
            .flatMap<Event>(id => this.eventRepository.getById(id))
            .map(newsFeed => newsFeed.toData())
            .run();
    }
}
