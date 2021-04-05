import { Either, EventTypeRawData } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventTypesRepository from "../boundaries/EventTypeRepository";

export interface GetEventTypeByIdArg extends AdminUseCaseArgs {
    id: string;
}

type GetEventTypeByIdErrors = ResourceNotFoundError | UnexpectedError;

export class GetEventTypeByIdUseCase extends AdminUseCase<
    GetEventTypeByIdArg,
    GetEventTypeByIdErrors,
    EventTypeRawData
> {
    constructor(
        private EventTypesRepository: EventTypesRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    public async run({
        id,
    }: GetEventTypeByIdArg): Promise<Either<GetEventTypeByIdErrors, EventTypeRawData>> {
        const result = await createIdOrResourceNotFound<GetEventTypeByIdErrors>(id)
            .flatMap(id => this.EventTypesRepository.getById(id))
            .map(eventType => eventType.toData())
            .run();

        return result;
    }
}
