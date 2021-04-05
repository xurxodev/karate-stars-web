import { Either, EventTypeRawData } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";

import EventTypesRepository from "../boundaries/EventTypeRepository";

export class GetEventTypesUseCase extends AdminUseCase<
    AdminUseCaseArgs,
    UnexpectedError,
    EventTypeRawData[]
> {
    constructor(
        private EventTypesRepository: EventTypesRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    public async run(_: AdminUseCaseArgs): Promise<Either<UnexpectedError, EventTypeRawData[]>> {
        const eventType = await this.EventTypesRepository.getAll();

        return Either.right(eventType.map(EventType => EventType.toData()));
    }
}
