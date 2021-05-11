import { EventType, Event, EventTypeData, Id } from "karate-stars-core";
import { commonCRUDTests } from "../../../common/api/testUtils/crud.spec";
import { ServerDataCreator, TestDataCreator } from "../../../common/api/testUtils/DataCreator";
import { eventDIKeys } from "../../../events/EventDIModule";
import { eventTypeDIKeys } from "../../EventTypeDIModule";
import { eventTypesEndpoint } from "../EventTypeRoutes";
import data from "./data.json";
import request from "supertest";
import {
    givenThereAreAnUserInServer,
    givenThereAreAPrincipalAndRestItemsInServer,
} from "../../../common/api/testUtils/ScenariosFactory";
import { generateToken, initServer } from "../../../common/api/testUtils/serverTest";

const entities = {
    eventTypes: data.eventTypes.map(data => EventType.create(data).get()),
    events: data.events.map(data => Event.create(data).get()),
};

const principalDataCreator: ServerDataCreator<EventTypeData, EventType> = {
    repositoryKey: eventTypeDIKeys.eventTypeRepository,
    items: () => {
        return entities.eventTypes;
    },
};

const restDataCreators = [
    {
        repositoryKey: eventDIKeys.eventRepository,
        items: () => entities.events,
    },
];

const testDataCreator: TestDataCreator<EventTypeData> = {
    givenAValidNewItem: () => {
        return { ...entities.eventTypes[0].toData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: () => {
        return {
            ...entities.eventTypes[0].toData(),
            id: Id.generateId().value,
            name: "",
        };
    },
    givenAValidModifiedItem: (): EventTypeData => {
        return {
            ...entities.eventTypes[0].toData(),
            name: entities.eventTypes[0].name + "modified",
        };
    },
    givenAInvalidModifiedItem: (): EventTypeData => {
        return { ...entities.eventTypes[0].toData(), name: "" };
    },
    givenAItemToDelete: (): EventTypeData => {
        return entities.eventTypes[1].toData();
    },
};

commonCRUDTests(eventTypesEndpoint, testDataCreator, principalDataCreator, restDataCreators);

describe(`Delete error by constraint with event tests for ${eventTypesEndpoint}`, () => {
    describe(`DELETE /${eventTypesEndpoint}/{id}`, () => {
        it("should return 409 conflict if the item to deleted is used", async () => {
            const data = givenThereAreAPrincipalAndRestItemsInServer(
                principalDataCreator,
                restDataCreators
            );
            const user = givenThereAreAnUserInServer({ admin: true });
            const server = await initServer();

            const res = await request(server)
                .delete(`/api/v1/${eventTypesEndpoint}/${data[0].id}`)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(409);
        });
    });
});
