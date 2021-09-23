import { MongoConector } from "../common/data/MongoConector";
import { appDIKeys, di } from "../CompositionRoot";
import UserRepository from "../users/domain/boundaries/UserRepository";
import { EventController } from "./api/EventController";
import EventMongoRepository from "./data/EventMongoRepository";
import EventRepository from "./domain/boundaries/EventRepository";
import { CreateEventUseCase } from "./domain/usecases/CreateEventUseCase";
import { DeleteEventUseCase } from "./domain/usecases/DeleteEventUseCase";
import { GetEventsUseCase } from "./domain/usecases/GetEventsUseCase";
import { GetEventByIdUseCase } from "./domain/usecases/GetEventByIdUseCase";
import { UpdateEventUseCase } from "./domain/usecases/UpdateEventUseCase";
import { eventTypeDIKeys } from "../event-types/EventTypeDIModule";
import EventTypeRepository from "../event-types/domain/boundaries/EventTypeRepository";
import CompetitorRepository from "../competitors/domain/boundaries/CompetitorRepository";
import { competitorDIKeys } from "../competitors/CompetitorDIModule";

export const eventDIKeys = {
    eventRepository: "eventRepository",
};

export function initializeEvents() {
    di.bindLazySingleton(
        eventDIKeys.eventRepository,
        () => new EventMongoRepository(di.get(MongoConector))
    );

    di.bindLazySingleton(
        GetEventsUseCase,
        () => new GetEventsUseCase(di.get<EventRepository>(eventDIKeys.eventRepository))
    );

    di.bindLazySingleton(
        GetEventByIdUseCase,
        () => new GetEventByIdUseCase(di.get<EventRepository>(eventDIKeys.eventRepository))
    );

    di.bindLazySingleton(
        CreateEventUseCase,
        () =>
            new CreateEventUseCase(
                di.get<EventRepository>(eventDIKeys.eventRepository),
                di.get<EventTypeRepository>(eventTypeDIKeys.eventTypeRepository),
                di.get<UserRepository>(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        UpdateEventUseCase,
        () =>
            new UpdateEventUseCase(
                di.get<EventRepository>(eventDIKeys.eventRepository),
                di.get<EventTypeRepository>(eventTypeDIKeys.eventTypeRepository),
                di.get<UserRepository>(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        DeleteEventUseCase,
        () =>
            new DeleteEventUseCase(
                di.get<EventRepository>(eventDIKeys.eventRepository),
                di.get<CompetitorRepository>(competitorDIKeys.CompetitorRepository),
                di.get<UserRepository>(appDIKeys.userRepository)
            )
    );

    di.bindFactory(
        EventController,
        () =>
            new EventController(
                di.get(appDIKeys.jwtAuthenticator),
                di.get(GetEventsUseCase),
                di.get(GetEventByIdUseCase),
                di.get(CreateEventUseCase),
                di.get(UpdateEventUseCase),
                di.get(DeleteEventUseCase)
            )
    );
}
