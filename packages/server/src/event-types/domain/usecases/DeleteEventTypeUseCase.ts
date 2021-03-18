import { Either, EitherAsync, Id, MaybeAsync } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventTypeRepository from "../boundaries/EventTypeRepository";

export interface GetEventTypeByIdArg extends AdminUseCaseArgs {
    id: string;
}

type DeleteEventTypeError = ResourceNotFoundError | UnexpectedError;

export class DeleteEventTypeUseCase extends AdminUseCase<
    GetEventTypeByIdArg,
    DeleteEventTypeError,
    ActionResult
> {
    constructor(private eventTypeRepository: EventTypeRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run({
        id,
    }: GetEventTypeByIdArg): Promise<Either<DeleteEventTypeError, ActionResult>> {
        const notFoundError = {
            kind: "ResourceNotFound",
            message: `EventType with id ${id} not found`,
        } as DeleteEventTypeError;

        const result = await EitherAsync.fromEither(Id.createExisted(id))
            .mapLeft(() => notFoundError)
            .flatMap(async id =>
                MaybeAsync.fromPromise(this.eventTypeRepository.getById(id)).toEither(notFoundError)
            )
            .flatMap<ActionResult>(eventType => this.eventTypeRepository.delete(eventType.id))
            .run();

        return result;
    }
}
