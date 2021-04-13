import { Event, EventData, EventType, EventTypeData, Id } from "karate-stars-core";
import { commonCRUDTests } from "../../../common/api/testUtils/crud.spec";
import { ServerDataCreator, TestDataCreator } from "../../../common/api/testUtils/DataCreator";
import {
    givenThereAreAnItemsAndDependenciesInServer,
    givenThereAreAnUserInServer,
} from "../../../common/api/testUtils/ScenariosFactory";
import { generateToken, initServer } from "../../../common/api/testUtils/serverTest";
import { eventTypeDIKeys } from "../../../event-types/EventTypeDIModule";
import { eventDIKeys } from "../../EventDIModule";
import { eventsEndpoint } from "../EventRoutes";
import request from "supertest";

const entities = [
    Event.create({
        id: "CYrgQdA0ZZm",
        name: "World Championships Maastricht 1984",
        year: 1984,
        typeId: "Jr6N73CZWtE",
    }).get(),
    Event.create({
        id: "QaFq0Lf2YDR",
        name: "European Championships Titograd 1989",
        year: 1989,
        typeId: "FEJ08kkHhqi",
    }).get(),
];

const eventTypeDependencies = [
    EventType.create({
        id: "Jr6N73CZWtE",
        name: "World Championships",
    }).get(),
    EventType.create({
        id: "FEJ08kkHhqi",
        name: "European Championships",
    }).get(),
];

const principalDataCreator: ServerDataCreator<EventData, Event> = {
    repositoryKey: eventDIKeys.eventRepository,
    items: () => {
        return entities;
    },
};

const dependenciesDataCreators: ServerDataCreator<EventTypeData, EventType>[] = [
    {
        repositoryKey: eventTypeDIKeys.eventTypeRepository,
        items: () => {
            return eventTypeDependencies;
        },
    },
];

const testDataCreator: TestDataCreator<EventData> = {
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
    givenAValidModifiedItem: (): EventData => {
        return { ...entities[0].toData(), name: entities[0].name + "modified" };
    },
    givenAInvalidModifiedItem: (): EventData => {
        return { ...entities[0].toData(), name: "" };
    },
};

commonCRUDTests(eventsEndpoint, testDataCreator, principalDataCreator, dependenciesDataCreators);

describe(`Invalid eventType dependency tests for ${eventsEndpoint}`, () => {
    describe(`POST /${eventsEndpoint}`, () => {
        it("should return 400 bad request if body contains invalid field values", async () => {
            givenThereAreAnItemsAndDependenciesInServer(
                principalDataCreator,
                dependenciesDataCreators
            );
            const user = givenThereAreAnUserInServer({ admin: true });
            const item = { ...testDataCreator.givenAValidNewItem(), typeId: "invalid" };

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
            givenThereAreAnItemsAndDependenciesInServer(
                principalDataCreator,
                dependenciesDataCreators
            );
            const user = givenThereAreAnUserInServer({ admin: true });
            const item = { ...testDataCreator.givenAValidModifiedItem(), typeId: "invalid" };

            const server = await initServer();

            const res = await request(server)
                .put(`/api/v1/${eventsEndpoint}/${item.id}`)
                .send(item)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(400);
        });
    });
});
