import { Either, EventTypeData } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";

import EventTypeRepository from "../boundaries/EventTypeRepository";

export class GetEventTypesUseCase extends AdminUseCase<
    AdminUseCaseArgs,
    UnexpectedError,
    EventTypeData[]
> {
    constructor(private EventTypeRepository: EventTypeRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run(_: AdminUseCaseArgs): Promise<Either<UnexpectedError, EventTypeData[]>> {
        const EventTypes = await this.EventTypeRepository.getAll();

        return Either.right(EventTypes.map(entity => entity.toData()));
    }
}
