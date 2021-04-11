import { Either, EventData } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventRepository from "../boundaries/EventRepository";

export interface GetEventByIdArg extends AdminUseCaseArgs {
    id: string;
}

type GetEventByIdError = ResourceNotFoundError | UnexpectedError;

export class GetEventByIdUseCase extends AdminUseCase<
    GetEventByIdArg,
    GetEventByIdError,
    EventData
> {
    constructor(private eventRepository: EventRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run({ id }: GetEventByIdArg): Promise<Either<GetEventByIdError, EventData>> {
        const result = await createIdOrResourceNotFound<GetEventByIdError>(id)
            .flatMap(id => this.eventRepository.getById(id))
            .map(entity => entity.toData())
            .run();

        return result;
    }
}
