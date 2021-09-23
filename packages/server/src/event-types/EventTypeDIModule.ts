import { MongoConector } from "../common/data/MongoConector";
import { appDIKeys, di } from "../CompositionRoot";
import UserRepository from "../users/domain/boundaries/UserRepository";
import { EventTypeController } from "./api/EventTypeController";
import EventTypeMongoRepository from "./data/EventTypeMongoRepository";
import EventTypeRepository from "./domain/boundaries/EventTypeRepository";
import { CreateEventTypeUseCase } from "./domain/usecases/CreateEventTypeUseCase";
import { DeleteEventTypeUseCase } from "./domain/usecases/DeleteEventTypeUseCase";
import { GetEventTypesUseCase } from "./domain/usecases/GetEventTypesUseCase";
import { GetEventTypeByIdUseCase } from "./domain/usecases/GetEventTypeByIdUseCase";
import { UpdateEventTypeUseCase } from "./domain/usecases/UpdateEventTypeUseCase";
import EventRepository from "../events/domain/boundaries/EventRepository";
import { eventDIKeys } from "../events/EventDIModule";

export const eventTypeDIKeys = {
    eventTypeRepository: "eventTypeRepository",
};

export function initializeEventTypes() {
    di.bindLazySingleton(
        eventTypeDIKeys.eventTypeRepository,
        () => new EventTypeMongoRepository(di.get(MongoConector))
    );

    di.bindLazySingleton(
        GetEventTypesUseCase,
        () =>
            new GetEventTypesUseCase(
                di.get<EventTypeRepository>(eventTypeDIKeys.eventTypeRepository)
            )
    );

    di.bindLazySingleton(
        GetEventTypeByIdUseCase,
        () =>
            new GetEventTypeByIdUseCase(
                di.get<EventTypeRepository>(eventTypeDIKeys.eventTypeRepository)
            )
    );

    di.bindLazySingleton(
        CreateEventTypeUseCase,
        () =>
            new CreateEventTypeUseCase(
                di.get<EventTypeRepository>(eventTypeDIKeys.eventTypeRepository),
                di.get<UserRepository>(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        UpdateEventTypeUseCase,
        () =>
            new UpdateEventTypeUseCase(
                di.get<EventTypeRepository>(eventTypeDIKeys.eventTypeRepository),
                di.get<UserRepository>(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        DeleteEventTypeUseCase,
        () =>
            new DeleteEventTypeUseCase(
                di.get<EventTypeRepository>(eventTypeDIKeys.eventTypeRepository),
                di.get<EventRepository>(eventDIKeys.eventRepository),
                di.get<UserRepository>(appDIKeys.userRepository)
            )
    );

    di.bindFactory(
        EventTypeController,
        () =>
            new EventTypeController(
                di.get(appDIKeys.jwtAuthenticator),
                di.get(GetEventTypesUseCase),
                di.get(GetEventTypeByIdUseCase),
                di.get(CreateEventTypeUseCase),
                di.get(UpdateEventTypeUseCase),
                di.get(DeleteEventTypeUseCase)
            )
    );
}
