import { Either, EventData } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import EventRepository from "../boundaries/EventRepository";

export interface GetEventByIdArg {
    id: string;
}

type GetEventByIdError = ResourceNotFoundError | UnexpectedError;

export class GetEventByIdUseCase {
    constructor(private eventRepository: EventRepository) {}

    public async execute({ id }: GetEventByIdArg): Promise<Either<GetEventByIdError, EventData>> {
        const result = await createIdOrResourceNotFound<GetEventByIdError>(id)
            .flatMap(id => this.eventRepository.getById(id))
            .map(entity => entity.toData())
            .run();

        return result;
    }
}
