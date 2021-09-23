import { Either, EventTypeData } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";

import EventTypeRepository from "../boundaries/EventTypeRepository";

export class GetEventTypesUseCase {
    constructor(private EventTypeRepository: EventTypeRepository) {}

    public async execute(): Promise<Either<UnexpectedError, EventTypeData[]>> {
        const EventTypes = await this.EventTypeRepository.getAll();

        return Either.right(EventTypes.map(entity => entity.toData()));
    }
}
