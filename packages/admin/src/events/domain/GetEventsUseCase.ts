import { EventRepository } from "./Boundaries";
import { EventData, Either } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class GetEventsUseCase {
    constructor(private eventRepository: EventRepository) {}

    async execute(): Promise<Either<DataError, EventData[]>> {
        const response = await this.eventRepository.getAll();

        return response.map(items => items.map(item => item.toData()));
    }
}
