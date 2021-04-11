import { Either, EventTypeData, EventType, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { updateResource, UpdateResourceError } from "../../../common/domain/UpdateResource";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import EventTypeRepository from "../boundaries/EventTypeRepository";

export interface UpdateResourceArgs extends AdminUseCaseArgs {
    id: string;
    data: EventTypeData;
}

export class UpdateEventTypeUseCase extends AdminUseCase<
    UpdateResourceArgs,
    UpdateResourceError<EventTypeData>,
    ActionResult
> {
    constructor(private EventTypeRepository: EventTypeRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected run({
        id,
        data,
    }: UpdateResourceArgs): Promise<Either<UpdateResourceError<EventTypeData>, ActionResult>> {
        const updateEntity = (data: EventTypeData, entity: EventType) => entity.update(data);
        const getById = (id: Id) => this.EventTypeRepository.getById(id);
        const saveEntity = (entity: EventType) => this.EventTypeRepository.save(entity);

        return updateResource(id, data, getById, updateEntity, saveEntity);
    }
}
