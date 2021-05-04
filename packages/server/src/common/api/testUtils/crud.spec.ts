import { Entity, EntityData, Id } from "karate-stars-core";
import request from "supertest";
import { initServer, generateToken } from "./serverTest";
import { ServerDataCreator, TestDataCreator } from "./DataCreator";
import {
    givenThereAreAnUserInServer,
    givenThereAreAnItemsAndDependenciesInServer,
} from "./ScenariosFactory";
import { jsonParser } from "./jsonParser";

export const commonCRUDTests = <TData extends EntityData, TEntity extends Entity<TData>>(
    endpoint: string,
    testDataCreator: TestDataCreator<TData>,
    principalDataCreator: ServerDataCreator<TData, TEntity>,
    dependenciesDataCreators?: ServerDataCreator<any, any>[]
) => {
    describe(`CRUD tests for ${endpoint}`, () => {
        describe(`GET /${endpoint}`, () => {
            it("should return expected item if token is of an admin user", async () => {
                const data = givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const user = givenThereAreAnUserInServer({ admin: true });

                const server = await initServer();

                const res = await request(server)
                    .get(`/api/v1/${endpoint}`)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(200);
                expect(res.body).toEqual(data);
            });
            it("should return 403 forbidden if token is not of an admin user", async () => {
                givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const user = givenThereAreAnUserInServer({ admin: false });

                const server = await initServer();

                const res = await request(server)
                    .get(`/api/v1/${endpoint}`)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(403);
            });
            it("should return 401 unauthorized if token is of an non existed user", async () => {
                givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                givenThereAreAnUserInServer({ admin: true });
                const notExistedUserId = Id.generateId();

                const server = await initServer();

                const res = await request(server)
                    .get(`/api/v1/${endpoint}`)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(notExistedUserId.value)}` });

                expect(res.status).toEqual(401);
            });
        });
        describe(`GET /${endpoint}/{id}`, () => {
            it("should return expected item if token is of an admin user", async () => {
                const data = givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const user = givenThereAreAnUserInServer({ admin: true });

                const server = await initServer();

                const res = await request(server)
                    .get(`/api/v1/${endpoint}/${data[0].id}`)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(200);
                expect(res.body).toEqual(data[0]);
            });
            it("should return 404 resource not found if item with id does not exist", async () => {
                givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const user = givenThereAreAnUserInServer({ admin: true });

                const notExistedItemId = Id.generateId();
                const server = await initServer();

                const res = await request(server)
                    .get(`/api/v1/${endpoint}/${notExistedItemId}`)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(404);
            });
            it("should return 403 forbidden if token is not of an admin user", async () => {
                const data = givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const user = givenThereAreAnUserInServer({ admin: false });

                const server = await initServer();

                const res = await request(server)
                    .get(`/api/v1/${endpoint}/${data[0].id}`)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(403);
            });
            it("should return 401 unauthorized if token is of an non existed user", async () => {
                givenThereAreAnUserInServer({ admin: true });

                const data = givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const notExistedUserId = Id.generateId();

                const server = await initServer();

                const res = await request(server)
                    .get(`/api/v1/${endpoint}/${data[0].id}`)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(notExistedUserId.value)}` });

                expect(res.status).toEqual(401);
            });
        });
        describe(`POST /${endpoint}`, () => {
            it("should create expected item if token is of an admin user", async () => {
                givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const item = testDataCreator.givenAValidNewItem();
                const user = givenThereAreAnUserInServer({ admin: true });

                const server = await initServer();

                const res = await request(server)
                    .post(`/api/v1/${endpoint}`)
                    .send(item)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(201);
                expect(res.body).toEqual({ ok: true, count: 1 });

                const verifyRes = await request(server)
                    .get(`/api/v1/${endpoint}/${item.id}`)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(verifyRes.status).toEqual(200);
                expect(verifyRes.body).toEqual(item);
            });
            it("should return 403 forbidden if token is not of an admin user", async () => {
                givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const item = testDataCreator.givenAValidNewItem();
                const user = givenThereAreAnUserInServer({ admin: false });

                const server = await initServer();

                const res = await request(server)
                    .post(`/api/v1/${endpoint}`)
                    .send(item)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(403);
            });
            it("should return 401 unauthorized if token is of an non existed user", async () => {
                givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                givenThereAreAnUserInServer({ admin: true });

                const item = testDataCreator.givenAValidNewItem();
                const notExistedUserId = Id.generateId();

                const server = await initServer();

                const res = await request(server)
                    .post(`/api/v1/${endpoint}`)
                    .send(item)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(notExistedUserId.value)}` });

                expect(res.status).toEqual(401);
            });
            it("should return 400 bad request if body contains invalid field values", async () => {
                givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const user = givenThereAreAnUserInServer({ admin: true });
                const item = testDataCreator.givenAInvalidNewItem();

                const server = await initServer();

                const res = await request(server)
                    .post(`/api/v1/${endpoint}`)
                    .send(item)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(400);
            });
            it("should return 400 bad request if body does not exist", async () => {
                givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const user = givenThereAreAnUserInServer({ admin: true });

                const server = await initServer();

                const res = await request(server)
                    .post(`/api/v1/${endpoint}`)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(400);
            });
            it("should return 409 conflict if already exist a item with the same id", async () => {
                const data = givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const user = givenThereAreAnUserInServer({ admin: true });

                const server = await initServer();

                const res = await request(server)
                    .post(`/api/v1/${endpoint}`)
                    .send(data[0])
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(409);
            });
        });
        describe(`PUT /${endpoint}/{id}`, () => {
            it("should upate the item if token is of an admin user", async () => {
                givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const item = testDataCreator.givenAValidModifiedItem();
                const user = givenThereAreAnUserInServer({ admin: true });

                const server = await initServer();

                const res = await request(server)
                    .put(`/api/v1/${endpoint}/${item.id}`)
                    .send(item)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(200);
                expect(res.body).toEqual({ ok: true, count: 1 });

                const verifyRes = await request(server)
                    .get(`/api/v1/${endpoint}/${item.id}`)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(verifyRes.status).toEqual(200);
                expect(verifyRes.body).toEqual(item);
            });
            it("should return 403 forbidden if token is not of an admin user", async () => {
                givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const item = testDataCreator.givenAValidModifiedItem();
                const user = givenThereAreAnUserInServer({ admin: false });

                const server = await initServer();

                const res = await request(server)
                    .put(`/api/v1/${endpoint}/${item.id}`)
                    .send(item)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(403);
            });
            it("should return 401 unauthorized if token is of an non existed user", async () => {
                givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                givenThereAreAnUserInServer({ admin: true });

                const item = testDataCreator.givenAValidModifiedItem();
                const notExistedUserId = Id.generateId();

                const server = await initServer();

                const res = await request(server)
                    .put(`/api/v1/${endpoint}/${item.id}`)
                    .send(item)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(notExistedUserId.value)}` });

                expect(res.status).toEqual(401);
            });
            it("should return 400 bad request if body contains invalid field values", async () => {
                givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const user = givenThereAreAnUserInServer({ admin: true });
                const item = testDataCreator.givenAInvalidModifiedItem();

                const server = await initServer();

                const res = await request(server)
                    .put(`/api/v1/${endpoint}/${item.id}`)
                    .send(item)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(400);
            });
            it("should return 400 bad request if body does not exist", async () => {
                givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const user = givenThereAreAnUserInServer({ admin: true });
                const item = testDataCreator.givenAValidModifiedItem();

                const server = await initServer();

                const res = await request(server)
                    .put(`/api/v1/${endpoint}/${item.id}`)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(400);
            });
            it("should return 404 resource not found if it does not exist the item", async () => {
                givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const item = testDataCreator.givenAValidModifiedItem();
                const user = givenThereAreAnUserInServer({ admin: true });

                const notExistedItemId = Id.generateId();

                const server = await initServer();

                const res = await request(server)
                    .put(`/api/v1/${endpoint}/${notExistedItemId}`)
                    .send(item)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(404);
            });
        });
        describe(`DELETE /${endpoint}/{id}`, () => {
            it("should return 200 removing expected news feed if token is of an admin user", async () => {
                const data = givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const user = givenThereAreAnUserInServer({ admin: true });
                const server = await initServer();
                const feedToRemove = testDataCreator.givenAItemToDelete();

                const res = await request(server)
                    .delete(`/api/v1/${endpoint}/${feedToRemove.id}`)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(200);

                const resAll = await request(server)
                    .get(`/api/v1/${endpoint}`)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(resAll.body).toEqual(data.filter(feed => feed.id !== feedToRemove.id));
            });
            it("should return 403 forbidden if token is not of an admin user", async () => {
                givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                const user = givenThereAreAnUserInServer({ admin: false });
                const server = await initServer();
                const feedToRemove = testDataCreator.givenAItemToDelete();

                const res = await request(server)
                    .delete(`/api/v1/${endpoint}/${feedToRemove.id}`)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(403);
            });
            it("should return 401 unauthorized if token is of an non existed user", async () => {
                givenThereAreAnItemsAndDependenciesInServer(
                    principalDataCreator,
                    dependenciesDataCreators
                );
                givenThereAreAnUserInServer({ admin: true });
                const server = await initServer();
                const feedToRemove = testDataCreator.givenAItemToDelete();

                const res = await request(server)
                    .delete(`/api/v1/${endpoint}/${feedToRemove.id}`)
                    .parse(jsonParser)
                    .set({ Authorization: `Bearer ${generateToken(Id.generateId().value)}` });

                expect(res.status).toEqual(401);
            });
        });
    });
};

// just to avoid warning, that no tests in test file
describe("Common tests for CRUD routes", () => {
    test("should be used per implementation", () => {});
});
