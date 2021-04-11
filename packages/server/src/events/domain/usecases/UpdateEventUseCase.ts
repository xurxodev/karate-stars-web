import { Either, EventData, Event, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { updateResource, UpdateResourceError } from "../../../common/domain/UpdateResource";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventRepository from "../boundaries/EventRepository";

export interface UpdateResourceArgs extends AdminUseCaseArgs {
    id: string;
    data: EventData;
}

export class UpdateEventUseCase extends AdminUseCase<
    UpdateResourceArgs,
    UpdateResourceError<EventData>,
    ActionResult
> {
    constructor(private eventRepository: EventRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected run({
        id,
        data,
    }: UpdateResourceArgs): Promise<Either<UpdateResourceError<EventData>, ActionResult>> {
        const updateEntity = (data: EventData, entity: Event) => entity.update(data);
        const getById = (id: Id) => this.eventRepository.getById(id);
        const saveEntity = (entity: Event) => this.eventRepository.save(entity);

        return updateResource(id, data, getById, updateEntity, saveEntity);
    }
}
