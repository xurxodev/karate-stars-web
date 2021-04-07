import { EventType, EventTypeData, Id } from "karate-stars-core";
import { commonCRUDTests, DataCreator } from "../../../common/api/testUtils/crud.spec";
import { appDIKeys } from "../../../CompositionRoot";
import { eventTypesEndpoint } from "../EventTypeRoutes";

const eventTypes = [
    EventType.create({
        id: Id.generateId().value,
        name: "Karate1 Premier League",
    }).get(),
    EventType.create({
        id: Id.generateId().value,
        name: "Karate1 Series A",
    }).get(),
];

const eventTypeCreator: DataCreator<EventTypeData, EventType> = {
    givenAInitialItems: () => {
        return eventTypes;
    },
    givenAValidNewItem: () => {
        return { ...eventTypes[0].toData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: () => {
        return {
            ...eventTypes[0].toData(),
            id: Id.generateId().value,
            name: "",
        };
    },
    givenAValidModifiedItem: (): EventTypeData => {
        return { ...eventTypes[0].toData(), name: eventTypes[0].name + "modified" };
    },
    givenAInvalidModifiedItem: (): EventTypeData => {
        return { ...eventTypes[0].toData(), name: "" };
    },
};

commonCRUDTests(eventTypesEndpoint, appDIKeys.eventTypeRepository, eventTypeCreator);
