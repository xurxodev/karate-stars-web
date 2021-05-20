import { EventTypeRepository } from "./Boundaries";
import { EventType, EventTypeData, Either } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";
import { createIdOrUnexpectedError } from "../../common/domain/utils";

export default class GetEventTypeByIdUseCase {
    constructor(private eventTypeRepository: EventTypeRepository) {}

    async execute(id: string): Promise<Either<DataError, EventTypeData>> {
        return await createIdOrUnexpectedError(id)
            .flatMap<EventType>(id => this.eventTypeRepository.getById(id))
            .map(newsFeed => newsFeed.toData())
            .run();
    }
}
