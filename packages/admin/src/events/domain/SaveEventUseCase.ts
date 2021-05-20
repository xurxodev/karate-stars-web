import { EventRepository } from "./Boundaries";
import { Either, Event } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class SaveEventUseCase {
    constructor(private eventRepository: EventRepository) {}

    async execute(entity: Event): Promise<Either<DataError, true>> {
        return this.eventRepository.save(entity);
    }
}
