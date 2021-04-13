import { EventType, EventTypeData, Id } from "karate-stars-core";
import { commonCRUDTests } from "../../../common/api/testUtils/crud.spec";
import { ServerDataCreator, TestDataCreator } from "../../../common/api/testUtils/DataCreator";
import { eventTypeDIKeys } from "../../EventTypeDIModule";
import { eventTypesEndpoint } from "../EventTypeRoutes";

const entities = [
    EventType.create({
        id: Id.generateId().value,
        name: "Karate1 Premier League",
    }).get(),
    EventType.create({
        id: Id.generateId().value,
        name: "Karate1 Series A",
    }).get(),
];

const principalDataCreator: ServerDataCreator<EventTypeData, EventType> = {
    repositoryKey: eventTypeDIKeys.eventTypeRepository,
    items: () => {
        return entities;
    },
};

const testDataCreator: TestDataCreator<EventTypeData> = {
    givenAValidNewItem: () => {
        return { ...entities[0].toData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: () => {
        return {
            ...entities[0].toData(),
            id: Id.generateId().value,
            name: "",
        };
    },
    givenAValidModifiedItem: (): EventTypeData => {
        return { ...entities[0].toData(), name: entities[0].name + "modified" };
    },
    givenAInvalidModifiedItem: (): EventTypeData => {
        return { ...entities[0].toData(), name: "" };
    },
};

commonCRUDTests(eventTypesEndpoint, testDataCreator, principalDataCreator);
