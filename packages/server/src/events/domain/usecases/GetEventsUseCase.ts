import { Either, EventData } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";

import EventRepository from "../boundaries/EventRepository";

export class GetEventsUseCase extends AdminUseCase<AdminUseCaseArgs, UnexpectedError, EventData[]> {
    constructor(private eventRepository: EventRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run(_: AdminUseCaseArgs): Promise<Either<UnexpectedError, EventData[]>> {
        const Events = await this.eventRepository.getAll();

        return Either.right(Events.map(entity => entity.toData()));
    }
}
