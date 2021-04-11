import { Either, EventData, Event, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createResource, CreateResourceError } from "../../../common/domain/CreateResource";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventRepository from "../boundaries/EventRepository";

export interface CreateResourceArgs extends AdminUseCaseArgs {
    data: EventData;
}

export class CreateEventUseCase extends AdminUseCase<
    CreateResourceArgs,
    CreateResourceError<EventData>,
    ActionResult
> {
    constructor(private eventRepository: EventRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected run({
        data,
    }: CreateResourceArgs): Promise<Either<CreateResourceError<EventData>, ActionResult>> {
        const createEntity = (data: EventData) => Event.create(data);
        const getById = (id: Id) => this.eventRepository.getById(id);
        const saveEntity = (entity: Event) => this.eventRepository.save(entity);

        return createResource(data, createEntity, getById, saveEntity);
    }
}
