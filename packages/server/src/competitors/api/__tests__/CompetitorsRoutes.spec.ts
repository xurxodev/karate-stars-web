import { Id, Competitor, CompetitorData, Category, Event, Country } from "karate-stars-core";
import { commonCRUDTests } from "../../../common/api/testUtils/crud.spec";
import { CompetitorsEndpoint } from "../CompetitorRoutes";
import { competitorDIKeys } from "../../CompetitorDIModule";
import { ServerDataCreator, TestDataCreator } from "../../../common/api/testUtils/DataCreator";
import data from "./data.json";
import { categoryDIKeys } from "../../../categories/CategoryDIModule";
import { countryDIKeys } from "../../../countries/CountryDIModule";
import { eventDIKeys } from "../../../events/EventDIModule";
import {
    givenThereAreAPrincipalAndRestItemsInServer,
    givenThereAreAnUserInServer,
} from "../../../common/api/testUtils/ScenariosFactory";
import { generateToken, initServer } from "../../../common/api/testUtils/serverTest";
import request from "supertest";

const entities = {
    competitors: data.competitors.map(data => Competitor.create(data as CompetitorData).get()),
    categories: data.categories.map(data => Category.create(data).get()),
    events: data.events.map(data => Event.create(data).get()),
    countries: data.countries.map(data => Country.create(data).get()),
};

const principalDataCreator: ServerDataCreator<CompetitorData, Competitor> = {
    repositoryKey: competitorDIKeys.CompetitorRepository,
    items: () => entities.competitors,
};

const dependenciesDataCreators = [
    {
        repositoryKey: categoryDIKeys.categoryRepository,
        items: () => entities.categories,
    },
    {
        repositoryKey: eventDIKeys.eventRepository,
        items: () => entities.events,
    },
    {
        repositoryKey: countryDIKeys.countryRepository,
        items: () => entities.countries,
    },
];

const testDataCreator: TestDataCreator<CompetitorData> = {
    givenAValidNewItem: () => {
        return { ...entities.competitors[0].toData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: () => {
        return {
            ...entities.competitors[0].toData(),
            id: Id.generateId().value,
            firstName: "",
        };
    },
    givenAValidModifiedItem: (): CompetitorData => {
        return {
            ...entities.competitors[0].toData(),
            firstName: data.competitors[0].firstName + "modified",
        };
    },
    givenAInvalidModifiedItem: (): CompetitorData => {
        return { ...entities.competitors[0].toData(), firstName: "" };
    },
    givenAItemToDelete: (): CompetitorData => {
        return entities.competitors[0].toData();
    },
};

commonCRUDTests(
    CompetitorsEndpoint,
    testDataCreator,
    principalDataCreator,
    dependenciesDataCreators
);

describe(`Invalid category dependency tests for ${CompetitorsEndpoint}`, () => {
    describe(`POST /${CompetitorsEndpoint}`, () => {
        it("should return 400 bad request if body contains invalid field values", async () => {
            givenThereAreAPrincipalAndRestItemsInServer(
                principalDataCreator,
                dependenciesDataCreators
            );
            const user = givenThereAreAnUserInServer({ admin: true });
            const item = { ...testDataCreator.givenAValidNewItem(), categoryId: "Aa6N73CZWtE" };

            const server = await initServer();

            const res = await request(server)
                .post(`/api/v1/${CompetitorsEndpoint}`)
                .send(item)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(400);
        });
    });
    describe(`PUT /${CompetitorsEndpoint}/{id}`, () => {
        it("should return 400 bad request if body contains non existed typeId", async () => {
            givenThereAreAPrincipalAndRestItemsInServer(
                principalDataCreator,
                dependenciesDataCreators
            );
            const user = givenThereAreAnUserInServer({ admin: true });
            const item = {
                ...testDataCreator.givenAValidModifiedItem(),
                categoryId: "Aa6N73CZWtE",
            };

            const server = await initServer();

            const res = await request(server)
                .put(`/api/v1/${CompetitorsEndpoint}/${item.id}`)
                .send(item)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(400);
        });
    });
});
describe(`Invalid country dependency tests for ${CompetitorsEndpoint}`, () => {
    describe(`POST /${CompetitorsEndpoint}`, () => {
        it("should return 400 bad request if body contains invalid field values", async () => {
            givenThereAreAPrincipalAndRestItemsInServer(
                principalDataCreator,
                dependenciesDataCreators
            );
            const user = givenThereAreAnUserInServer({ admin: true });
            const item = { ...testDataCreator.givenAValidNewItem(), countryId: "Aa6N73CZWtE" };

            const server = await initServer();

            const res = await request(server)
                .post(`/api/v1/${CompetitorsEndpoint}`)
                .send(item)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(400);
        });
    });
    describe(`PUT /${CompetitorsEndpoint}/{id}`, () => {
        it("should return 400 bad request if body contains invalid field values", async () => {
            givenThereAreAPrincipalAndRestItemsInServer(
                principalDataCreator,
                dependenciesDataCreators
            );
            const user = givenThereAreAnUserInServer({ admin: true });
            const item = { ...testDataCreator.givenAValidModifiedItem(), countryId: "Aa6N73CZWtE" };

            const server = await initServer();

            const res = await request(server)
                .put(`/api/v1/${CompetitorsEndpoint}/${item.id}`)
                .send(item)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(400);
        });
    });
});
describe(`Invalid achievement category dependency tests for ${CompetitorsEndpoint}`, () => {
    describe(`POST /${CompetitorsEndpoint}`, () => {
        it("should return 400 bad request if body contains invalid field values", async () => {
            givenThereAreAPrincipalAndRestItemsInServer(
                principalDataCreator,
                dependenciesDataCreators
            );
            const user = givenThereAreAnUserInServer({ admin: true });
            const item = testDataCreator.givenAValidNewItem();
            const invalidItem = {
                ...item,
                achievements: item.achievements.map(achievement => ({
                    ...achievement,
                    categoryId: "Aa6N73CZWtE",
                })),
            };

            const server = await initServer();

            const res = await request(server)
                .post(`/api/v1/${CompetitorsEndpoint}`)
                .send(invalidItem)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(400);
        });
    });
    describe(`PUT /${CompetitorsEndpoint}/{id}`, () => {
        it("should return 400 bad request if body contains invalid field values", async () => {
            givenThereAreAPrincipalAndRestItemsInServer(
                principalDataCreator,
                dependenciesDataCreators
            );
            const user = givenThereAreAnUserInServer({ admin: true });
            const item = testDataCreator.givenAValidModifiedItem();
            const invalidItem = {
                ...item,
                achievements: item.achievements.map(achievement => ({
                    ...achievement,
                    categoryId: "Aa6N73CZWtE",
                })),
            };

            const server = await initServer();

            const res = await request(server)
                .put(`/api/v1/${CompetitorsEndpoint}/${item.id}`)
                .send(invalidItem)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(400);
        });
    });
});
describe(`Invalid achievement event dependency tests for ${CompetitorsEndpoint}`, () => {
    describe(`POST /${CompetitorsEndpoint}`, () => {
        it("should return 400 bad request if body contains invalid field values", async () => {
            givenThereAreAPrincipalAndRestItemsInServer(
                principalDataCreator,
                dependenciesDataCreators
            );
            const user = givenThereAreAnUserInServer({ admin: true });
            const item = testDataCreator.givenAValidNewItem();
            const invalidItem = {
                ...item,
                achievements: item.achievements.map(achievement => ({
                    ...achievement,
                    eventId: "Aa6N73CZWtE",
                })),
            };

            const server = await initServer();

            const res = await request(server)
                .post(`/api/v1/${CompetitorsEndpoint}`)
                .send(invalidItem)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(400);
        });
    });
    describe(`PUT /${CompetitorsEndpoint}/{id}`, () => {
        it("should return 400 bad request if body contains invalid field values", async () => {
            givenThereAreAPrincipalAndRestItemsInServer(
                principalDataCreator,
                dependenciesDataCreators
            );
            const user = givenThereAreAnUserInServer({ admin: true });
            const item = testDataCreator.givenAValidModifiedItem();
            const invalidItem = {
                ...item,
                achievements: item.achievements.map(achievement => ({
                    ...achievement,
                    eventId: "Aa6N73CZWtE",
                })),
            };

            const server = await initServer();

            const res = await request(server)
                .put(`/api/v1/${CompetitorsEndpoint}/${item.id}`)
                .send(invalidItem)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(400);
        });
    });
});
