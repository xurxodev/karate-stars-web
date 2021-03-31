import { Either } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventTypeRepository from "../boundaries/EventTypeRepository";

export interface DeleteEventTypeArgs extends AdminUseCaseArgs {
    id: string;
}

type DeleteEventTypeError = ResourceNotFoundError | UnexpectedError;

export class DeleteEventTypeUseCase extends AdminUseCase<
    DeleteEventTypeArgs,
    DeleteEventTypeError,
    ActionResult
> {
    constructor(private eventTypeRepository: EventTypeRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run({
        id,
    }: DeleteEventTypeArgs): Promise<Either<DeleteEventTypeError, ActionResult>> {
        const result = await createIdOrResourceNotFound<DeleteEventTypeError>(id)
            .flatMap(async id => this.eventTypeRepository.getById(id))
            .flatMap<ActionResult>(eventType => this.eventTypeRepository.delete(eventType.id))
            .run();

        return result;
    }
}
