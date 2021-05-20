import { EventTypeRepository } from "./Boundaries";
import { EventTypeData, Either } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class GetEventTypesUseCase {
    constructor(private eventTypeRepository: EventTypeRepository) {}

    async execute(): Promise<Either<DataError, EventTypeData[]>> {
        const response = await this.eventTypeRepository.getAll();

        return response.map(items => items.map(item => item.toData()));
    }
}
