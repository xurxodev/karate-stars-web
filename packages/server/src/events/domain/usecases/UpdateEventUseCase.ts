import { Either, EventData, Event, Id, ValidationError } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { updateResource, UpdateResourceError } from "../../../common/domain/UpdateResource";
import EventTypeRepository from "../../../event-types/domain/boundaries/EventTypeRepository";
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
    constructor(
        private eventRepository: EventRepository,
        private eventTypeRepository: EventTypeRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({
        id,
        data,
    }: UpdateResourceArgs): Promise<Either<UpdateResourceError<EventData>, ActionResult>> {
        const updateEntity = (data: EventData, entity: Event) => entity.update(data);
        const getById = (id: Id) => this.eventRepository.getById(id);
        const saveEntity = (entity: Event) => this.eventRepository.save(entity);
        const validateDependencies = async (entity: Event) => {
            const eventTypeResult = await this.eventTypeRepository.getById(entity.typeId);

            return eventTypeResult.fold(
                () =>
                    Either.left<ValidationError<EventData>[], Event>([
                        {
                            property: "typeId" as const,
                            errors: ["invalid_dependency"],
                            type: "event",
                            value: entity.typeId,
                        },
                    ]),
                () => Either.right<ValidationError<EventData>[], Event>(entity)
            );
        };

        return updateResource(id, data, getById, updateEntity, saveEntity, validateDependencies);
    }
}
