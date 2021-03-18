import { Either, EitherAsync, Id, EventTypeRawData, MaybeAsync } from "karate-stars-core";
import { ResourceNotFoundError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventTypesRepository from "../boundaries/EventTypeRepository";

export interface GetEventTypeByIdArg extends AdminUseCaseArgs {
    id: string;
}

export class GetEventTypeByIdUseCase extends AdminUseCase<
    GetEventTypeByIdArg,
    ResourceNotFoundError,
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
    }: GetEventTypeByIdArg): Promise<Either<ResourceNotFoundError, EventTypeRawData>> {
        const notFoundError = {
            kind: "ResourceNotFound",
            message: `EventType with id ${id} not found`,
        } as ResourceNotFoundError;

        const result = await EitherAsync.fromEither(Id.createExisted(id))
            .mapLeft(() => notFoundError)
            .flatMap(id =>
                MaybeAsync.fromPromise(this.EventTypesRepository.getById(id)).toEither(
                    notFoundError
                )
            )
            .map(EventType => EventType.toRawData())
            .run();

        return result;
    }
}
