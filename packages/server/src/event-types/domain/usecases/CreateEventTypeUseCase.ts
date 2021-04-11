import { Either, EventTypeData, EventType, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createResource, CreateResourceError } from "../../../common/domain/CreateResource";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventTypeRepository from "../boundaries/EventTypeRepository";

export interface CreateResourceArgs extends AdminUseCaseArgs {
    data: EventTypeData;
}

export class CreateEventTypeUseCase extends AdminUseCase<
    CreateResourceArgs,
    CreateResourceError<EventTypeData>,
    ActionResult
> {
    constructor(private EventTypeRepository: EventTypeRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected run({
        data,
    }: CreateResourceArgs): Promise<Either<CreateResourceError<EventTypeData>, ActionResult>> {
        const createEntity = (data: EventTypeData) => EventType.create(data);
        const getById = (id: Id) => this.EventTypeRepository.getById(id);
        const saveEntity = (entity: EventType) => this.EventTypeRepository.save(entity);

        return createResource(data, createEntity, getById, saveEntity);
    }
}
