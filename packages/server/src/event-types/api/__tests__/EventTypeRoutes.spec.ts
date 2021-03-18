import { EventType, EventTypeRawData, Id } from "karate-stars-core";
import * as CompositionRoot from "../../../CompositionRoot";
import { commonCRUDTests, DataCreator } from "../../../common/api/testUtils/crud.spec";
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

const eventTypeCreator: DataCreator<EventTypeRawData, EventType> = {
    givenAInitialItems: () => {
        return eventTypes;
    },
    givenAValidNewItem: () => {
        return { ...eventTypes[0].toRawData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: () => {
        return {
            ...eventTypes[0].toRawData(),
            id: Id.generateId().value,
            name: "",
        };
    },
    givenAValidModifiedItem: (): EventTypeRawData => {
        return { ...eventTypes[0].toRawData(), name: eventTypes[0].name + "modified" };
    },
    givenAInvalidModifiedItem: (): EventTypeRawData => {
        return { ...eventTypes[0].toRawData(), name: "" };
    },
};

commonCRUDTests(eventTypesEndpoint, CompositionRoot.names.eventTypeRepository, eventTypeCreator);
