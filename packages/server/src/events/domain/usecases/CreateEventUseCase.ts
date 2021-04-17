import { Either, EventData, Event, Id, ValidationError } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createResource, CreateResourceError } from "../../../common/domain/CreateResource";
import EventTypeRepository from "../../../event-types/domain/boundaries/EventTypeRepository";
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
    constructor(
        private eventRepository: EventRepository,
        private eventTypeRepository: EventTypeRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({
        data,
    }: CreateResourceArgs): Promise<Either<CreateResourceError<EventData>, ActionResult>> {
        const createEntity = (data: EventData) => Event.create(data);
        const getById = (id: Id) => this.eventRepository.getById(id);
        const saveEntity = (entity: Event) => this.eventRepository.save(entity);
        const validateDependencies = async (entity: Event) => {
            return (await this.eventTypeRepository.getById(entity.typeId))
                .mapLeft(() => [
                    {
                        property: "typeId" as const,
                        errors: ["invalid_dependency"],
                        type: Event.name,
                        value: entity.typeId,
                    } as ValidationError<EventData>,
                ])
                .map(() => entity);
        };

        return createResource(data, createEntity, getById, saveEntity, validateDependencies);
    }
}
