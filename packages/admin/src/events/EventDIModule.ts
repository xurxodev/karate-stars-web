import { di, appDIKeys } from "../CompositionRoot";
import GetEventTypesUseCase from "../event-types/domain/GetEventTypesUseCase";
import EventApiRepository from "./data/EventApiRepository";
import { EventRepository } from "./domain/Boundaries";
import DeleteEventUseCase from "./domain/DeleteEventUseCase";
import GetEventByIdUseCase from "./domain/GetEventByIdUseCase";
import GetEventsUseCase from "./domain/GetEventsUseCase";
import SaveEventUseCase from "./domain/SaveEventUseCase";
import EventDetailBloc from "./presentation/event-detail/EventDetailBloc";
import EventListBloc from "./presentation/event-list/EventListBloc";

export const eventDIKeys = {
    eventRepository: "eventRepository",
};

export function initEvents() {
    di.bindLazySingleton(
        eventDIKeys.eventRepository,
        () =>
            new EventApiRepository(
                di.get(appDIKeys.axiosInstanceAPI),
                di.get(appDIKeys.tokenStorage)
            )
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
        SaveEventUseCase,
        () => new SaveEventUseCase(di.get<EventRepository>(eventDIKeys.eventRepository))
    );

    di.bindLazySingleton(
        DeleteEventUseCase,
        () => new DeleteEventUseCase(di.get<EventRepository>(eventDIKeys.eventRepository))
    );

    di.bindFactory(
        EventListBloc,
        () => new EventListBloc(di.get(GetEventsUseCase), di.get(DeleteEventUseCase))
    );

    di.bindFactory(
        EventDetailBloc,
        () =>
            new EventDetailBloc(
                di.get(GetEventByIdUseCase),
                di.get(SaveEventUseCase),
                di.get(GetEventTypesUseCase)
            )
    );
}
