import { Either, EventTypeRawData } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import {
    ConflictError,
    ResourceNotFoundError,
    UnexpectedError,
    ValidationErrors,
} from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
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
        return await createIdOrResourceNotFound<UpdateEventTypeError>(itemId)
            .flatMap(async id => this.EventTypesRepository.getById(id))
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
