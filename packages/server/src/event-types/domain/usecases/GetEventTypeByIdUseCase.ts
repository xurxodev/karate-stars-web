import { Either, EventTypeData } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventTypeRepository from "../boundaries/EventTypeRepository";

export interface GetEventTypeByIdArg extends AdminUseCaseArgs {
    id: string;
}

type GetEventTypeByIdError = ResourceNotFoundError | UnexpectedError;

export class GetEventTypeByIdUseCase extends AdminUseCase<
    GetEventTypeByIdArg,
    GetEventTypeByIdError,
    EventTypeData
> {
    constructor(private EventTypeRepository: EventTypeRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run({
        id,
    }: GetEventTypeByIdArg): Promise<Either<GetEventTypeByIdError, EventTypeData>> {
        const result = await createIdOrResourceNotFound<GetEventTypeByIdError>(id)
            .flatMap(id => this.EventTypeRepository.getById(id))
            .map(entity => entity.toData())
            .run();

        return result;
    }
}
