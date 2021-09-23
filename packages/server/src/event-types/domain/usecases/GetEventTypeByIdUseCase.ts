import { Either, EventTypeData } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import EventTypeRepository from "../boundaries/EventTypeRepository";

export interface GetEventTypeByIdArg {
    id: string;
}

type GetEventTypeByIdError = ResourceNotFoundError | UnexpectedError;

export class GetEventTypeByIdUseCase {
    constructor(private EventTypeRepository: EventTypeRepository) {}

    public async execute({
        id,
    }: GetEventTypeByIdArg): Promise<Either<GetEventTypeByIdError, EventTypeData>> {
        const result = await createIdOrResourceNotFound<GetEventTypeByIdError>(id)
            .flatMap(id => this.EventTypeRepository.getById(id))
            .map(entity => entity.toData())
            .run();

        return result;
    }
}
