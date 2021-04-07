import { Either, EventType, EventTypeData, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { DeleteResourceUseCase } from "../../../common/domain/DeleteResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventTypeRepository from "../boundaries/EventTypeRepository";

export class DeleteEventTypeUseCase extends DeleteResourceUseCase<EventTypeData, EventType> {
    constructor(private eventtypeRepository: EventTypeRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected getEntityById(
        id: Id
    ): Promise<Either<UnexpectedError | ResourceNotFoundError, EventType>> {
        return this.eventtypeRepository.getById(id);
    }

    protected deleteEntity(id: Id): Promise<Either<UnexpectedError, ActionResult>> {
        return this.eventtypeRepository.delete(id);
    }
}
