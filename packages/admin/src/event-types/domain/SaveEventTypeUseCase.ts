import { EventTypeRepository } from "./Boundaries";
import { Either, EventType } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class SaveEventTypeUseCase {
    constructor(private eventTypeRepository: EventTypeRepository) {}

    async execute(entity: EventType): Promise<Either<DataError, true>> {
        return this.eventTypeRepository.save(entity);
    }
}
