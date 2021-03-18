import { Either, EitherAsync, EventType, EventTypeRawData } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ConflictError, UnexpectedError, ValidationErrors } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventTypeRepository from "../boundaries/EventTypeRepository";

export interface CreateEventTypeArg extends AdminUseCaseArgs {
    item: EventTypeRawData;
}

type CreateEventTypeError = ValidationErrors<EventTypeRawData> | UnexpectedError | ConflictError;

export class CreateEventTypeUseCase extends AdminUseCase<
    CreateEventTypeArg,
    CreateEventTypeError,
    ActionResult
> {
    constructor(private EventTypesRepository: EventTypeRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run({
        item,
    }: CreateEventTypeArg): Promise<Either<CreateEventTypeError, ActionResult>> {
        return EitherAsync.fromEither(EventType.create(item))
            .mapLeft(
                error =>
                    ({
                        kind: "ValidationErrors",
                        errors: error,
                    } as CreateEventTypeError)
            )
            .flatMap(async entity => {
                const existedItem = await this.EventTypesRepository.getById(entity.id);

                return existedItem.fold(
                    () => Either.right<CreateEventTypeError, EventType>(entity),
                    () =>
                        Either.left<CreateEventTypeError, EventType>({
                            kind: "ConflictError",
                            message: "Already exist a news feed item with id " + entity.id.value,
                        } as ConflictError)
                );
            })
            .flatMap(entity => this.EventTypesRepository.save(entity))
            .run();
    }
}
