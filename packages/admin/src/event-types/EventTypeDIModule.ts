import { di, appDIKeys } from "../CompositionRoot";
import EventTypeApiRepository from "./data/EventTypeApiRepository";
import { EventTypeRepository } from "./domain/Boundaries";
import DeleteEventTypeUseCase from "./domain/DeleteEventTypeUseCase";
import GetEventTypeByIdUseCase from "./domain/GetEventTypeByIdUseCase";
import GetEventTypesUseCase from "./domain/GetEventTypesUseCase";
import SaveEventTypeUseCase from "./domain/SaveEventTypeUseCase";
import EventTypeDetailBloc from "./presentation/event-type-detail/EventTypeDetailBloc";
import EventTypeListBloc from "./presentation/event-type-list/EventTypeListBloc";

export const eventTypeDIKeys = {
    eventTypeRepository: "EventTypeRepository",
};

export function initEventTypes() {
    di.bindLazySingleton(
        eventTypeDIKeys.eventTypeRepository,
        () =>
            new EventTypeApiRepository(
                di.get(appDIKeys.axiosInstanceAPI),
                di.get(appDIKeys.tokenStorage)
            )
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
        SaveEventTypeUseCase,
        () =>
            new SaveEventTypeUseCase(
                di.get<EventTypeRepository>(eventTypeDIKeys.eventTypeRepository)
            )
    );

    di.bindLazySingleton(
        DeleteEventTypeUseCase,
        () =>
            new DeleteEventTypeUseCase(
                di.get<EventTypeRepository>(eventTypeDIKeys.eventTypeRepository)
            )
    );

    di.bindFactory(
        EventTypeListBloc,
        () => new EventTypeListBloc(di.get(GetEventTypesUseCase), di.get(DeleteEventTypeUseCase))
    );

    di.bindFactory(
        EventTypeDetailBloc,
        () => new EventTypeDetailBloc(di.get(GetEventTypeByIdUseCase), di.get(SaveEventTypeUseCase))
    );
}
