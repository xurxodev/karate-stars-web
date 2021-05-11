import { Competitor, Event, EventData, EventType, Id, CompetitorData } from "karate-stars-core";
import { commonCRUDTests } from "../../../common/api/testUtils/crud.spec";
import { ServerDataCreator, TestDataCreator } from "../../../common/api/testUtils/DataCreator";
import {
    givenThereAreAPrincipalAndRestItemsInServer,
    givenThereAreAnUserInServer,
} from "../../../common/api/testUtils/ScenariosFactory";
import { generateToken, initServer } from "../../../common/api/testUtils/serverTest";
import { eventTypeDIKeys } from "../../../event-types/EventTypeDIModule";
import { eventDIKeys } from "../../EventDIModule";
import { eventsEndpoint } from "../EventRoutes";
import request from "supertest";
import data from "./data.json";
import { competitorDIKeys } from "../../../competitors/CompetitorDIModule";

const entities = {
    competitors: data.competitors.map(data => Competitor.create(data as CompetitorData).get()),
    eventTypes: data.eventTypes.map(data => EventType.create(data).get()),
    events: data.events.map(data => Event.create(data).get()),
};

const principalDataCreator: ServerDataCreator<EventData, Event> = {
    repositoryKey: eventDIKeys.eventRepository,
    items: () => {
        return entities.events;
    },
};

const restDataCreators = [
    {
        repositoryKey: eventTypeDIKeys.eventTypeRepository,
        items: () => entities.eventTypes,
    },
    {
        repositoryKey: competitorDIKeys.CompetitorRepository,
        items: () => entities.competitors,
    },
];

const testDataCreator: TestDataCreator<EventData> = {
    givenAValidNewItem: () => {
        return { ...entities.events[0].toData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: () => {
        return {
            ...entities.events[0].toData(),
            id: Id.generateId().value,
            name: "",
        };
    },
    givenAValidModifiedItem: (): EventData => {
        return { ...entities.events[0].toData(), name: entities.events[0].name + "modified" };
    },
    givenAInvalidModifiedItem: (): EventData => {
        return { ...entities.events[0].toData(), name: "" };
    },
    givenAItemToDelete: (): EventData => {
        return entities.events[0].toData();
    },
};

commonCRUDTests(eventsEndpoint, testDataCreator, principalDataCreator, restDataCreators);

describe(`Invalid eventType dependency tests for ${eventsEndpoint}`, () => {
    describe(`POST /${eventsEndpoint}`, () => {
        it("should return 400 bad request if body contains invalid field values", async () => {
            givenThereAreAPrincipalAndRestItemsInServer(principalDataCreator, restDataCreators);
            const user = givenThereAreAnUserInServer({ admin: true });
            const item = { ...testDataCreator.givenAValidNewItem(), typeId: "Aa6N73CZWtE" };

            const server = await initServer();

            const res = await request(server)
                .post(`/api/v1/${eventsEndpoint}`)
                .send(item)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(400);
        });
    });
    describe(`PUT /${eventsEndpoint}/{id}`, () => {
        it("should return 400 bad request if body contains non existed typeId", async () => {
            givenThereAreAPrincipalAndRestItemsInServer(principalDataCreator, restDataCreators);
            const user = givenThereAreAnUserInServer({ admin: true });
            const item = { ...testDataCreator.givenAValidModifiedItem(), typeId: "Aa6N73CZWtE" };

            const server = await initServer();

            const res = await request(server)
                .put(`/api/v1/${eventsEndpoint}/${item.id}`)
                .send(item)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(400);
        });
    });
});
describe(`Delete error by constraint with competitor tests for ${eventsEndpoint}`, () => {
    describe(`DELETE /${eventsEndpoint}/{id}`, () => {
        it("should return 409 conflict if the item to deleted is used", async () => {
            const data = givenThereAreAPrincipalAndRestItemsInServer(
                principalDataCreator,
                restDataCreators
            );
            const user = givenThereAreAnUserInServer({ admin: true });
            const server = await initServer();

            const res = await request(server)
                .delete(`/api/v1/${eventsEndpoint}/${data[2].id}`)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(409);
        });
    });
});
