import { Either, EitherAsync, Id, MaybeAsync, EventTypeRawData } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import {
    ConflictError,
    ResourceNotFoundError,
    UnexpectedError,
    ValidationErrors,
} from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventTypesRepository from "../boundaries/EventTypeRepository";

export interface UpdateEventTypeArg extends AdminUseCaseArgs {
    itemId: string;
    item: EventTypeRawData;
}

type UpdateEventTypeError =
    | ConflictError
    | ResourceNotFoundError
    | UnexpectedError
    | ValidationErrors<EventTypeRawData>;

export class UpdateEventTypeUseCase extends AdminUseCase<
    UpdateEventTypeArg,
    UpdateEventTypeError,
    ActionResult
> {
    constructor(
        private EventTypesRepository: EventTypesRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    public async run({
        itemId,
        item,
    }: UpdateEventTypeArg): Promise<Either<UpdateEventTypeError, ActionResult>> {
        const notFoundError = {
            kind: "ResourceNotFound",
            message: `EventType with id ${itemId} not found`,
        } as ResourceNotFoundError;

        return await EitherAsync.fromEither(Id.createExisted(itemId))
            .mapLeft<UpdateEventTypeError>(() => notFoundError)
            .flatMap(async id =>
                MaybeAsync.fromPromise(this.EventTypesRepository.getById(id)).toEither(
                    notFoundError
                )
            )
            .flatMap(async existedFeed =>
                existedFeed.update(item).mapLeft(error => ({
                    kind: "ValidationErrors",
                    errors: error,
                }))
            )
            .flatMap(entity => this.EventTypesRepository.save(entity))
            .run();
    }
}
