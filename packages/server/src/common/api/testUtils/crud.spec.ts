import { Email, Entity, EntityData, Id, Password, User } from "karate-stars-core";
import request from "supertest";
import * as CompositionRoot from "../../../CompositionRoot";
import { initServer, generateToken } from "./serverTest";
import { FakeImageRepository } from "./FakeImageRepository";
import { FakeUserRepository } from "./FakeUserRepository";
import { FakeGenericRepository } from "./FakeGenericRepository";

export interface DataCreator<RawData extends EntityData, T extends Entity<RawData>> {
    givenAInitialItems: () => T[];
    givenAValidNewItem: () => RawData;
    givenAInvalidNewItem: () => RawData;
    givenAValidModifiedItem: () => RawData;
    givenAInvalidModifiedItem: () => RawData;
}

export const commonCRUDTests = <RawData extends EntityData, T extends Entity<RawData>>(
    endpoint: string,
    repositoryKey: string,
    dataCreator: DataCreator<RawData, T>
) => {
    const givenThereAreAnItems = () => {
        const initialItems = dataCreator.givenAInitialItems();
        CompositionRoot.di.bindLazySingleton(
            repositoryKey,
            () => new FakeGenericRepository<RawData, T>(initialItems)
        );

        CompositionRoot.di.bindLazySingleton(
            CompositionRoot.appDIKeys.imageRepository,
            () => new FakeImageRepository()
        );

        return initialItems.map(feed => feed.toData());
    };

    const givenThereAreAnUser = (params: { admin: boolean }) => {
        const user: User = User.createExisted({
            id: Id.generateId(),
            name: "Example user",
            image: "https://pbs.twimg.com/profile_images/1151113544362078209/chgA6VO9_400x400.jpg",
            email: Email.create("info@karatestarsapp.com").get(),
            password: Password.create("password").get(),
            isAdmin: params.admin,
            isClientUser: true,
        });

        CompositionRoot.di.bindLazySingleton(
            CompositionRoot.appDIKeys.userRepository,
            () => new FakeUserRepository([user])
        );

        return user;
    };

    describe(`CRUD tests for ${endpoint}`, () => {
        describe(`GET /${endpoint}`, () => {
            it("should return expected item if token is of an admin user", async () => {
                const data = givenThereAreAnItems();
                const user = givenThereAreAnUser({ admin: true });

                const server = await initServer();

                const res = await request(server)
                    .get(`/api/v1/${endpoint}`)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(200);
                expect(res.body).toEqual(data);
            });
            it("should return 403 forbidden if token is not of an admin user", async () => {
                givenThereAreAnItems();
                const user = givenThereAreAnUser({ admin: false });

                const server = await initServer();

                const res = await request(server)
                    .get(`/api/v1/${endpoint}`)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(403);
            });
            it("should return 401 unauthorized if token is of an non existed user", async () => {
                givenThereAreAnItems();
                givenThereAreAnUser({ admin: true });
                const notExistedUserId = Id.generateId();

                const server = await initServer();

                const res = await request(server)
                    .get(`/api/v1/${endpoint}`)
                    .set({ Authorization: `Bearer ${generateToken(notExistedUserId.value)}` });

                expect(res.status).toEqual(401);
            });
        });
        describe(`GET /${endpoint}/{id}`, () => {
            it("should return expected item if token is of an admin user", async () => {
                const data = givenThereAreAnItems();
                const user = givenThereAreAnUser({ admin: true });

                const server = await initServer();

                const res = await request(server)
                    .get(`/api/v1/${endpoint}/${data[0].id}`)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(200);
                expect(res.body).toEqual(data[0]);
            });
            it("should return 404 resource not found if item with id does not exist", async () => {
                givenThereAreAnItems();
                const user = givenThereAreAnUser({ admin: true });

                const notExistedItemId = Id.generateId();
                const server = await initServer();

                const res = await request(server)
                    .get(`/api/v1/${endpoint}/${notExistedItemId}`)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(404);
            });
            it("should return 403 forbidden if token is not of an admin user", async () => {
                const data = givenThereAreAnItems();
                const user = givenThereAreAnUser({ admin: false });

                const server = await initServer();

                const res = await request(server)
                    .get(`/api/v1/${endpoint}/${data[0].id}`)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(403);
            });
            it("should return 401 unauthorized if token is of an non existed user", async () => {
                givenThereAreAnUser({ admin: true });

                const data = givenThereAreAnItems();
                const notExistedUserId = Id.generateId();

                const server = await initServer();

                const res = await request(server)
                    .get(`/api/v1/${endpoint}/${data[0].id}`)
                    .set({ Authorization: `Bearer ${generateToken(notExistedUserId.value)}` });

                expect(res.status).toEqual(401);
            });
        });
        describe(`POST /${endpoint}`, () => {
            it("should create expected item if token is of an admin user", async () => {
                givenThereAreAnItems();
                const item = dataCreator.givenAValidNewItem();
                const user = givenThereAreAnUser({ admin: true });

                const server = await initServer();

                const res = await request(server)
                    .post(`/api/v1/${endpoint}`)
                    .send(item)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(201);
                expect(res.body).toEqual({ ok: true, count: 1 });

                const verifyRes = await request(server)
                    .get(`/api/v1/${endpoint}/${item.id}`)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(verifyRes.status).toEqual(200);
                expect(verifyRes.body).toEqual(item);
            });
            it("should return 403 forbidden if token is not of an admin user", async () => {
                givenThereAreAnItems();
                const item = dataCreator.givenAValidNewItem();
                const user = givenThereAreAnUser({ admin: false });

                const server = await initServer();

                const res = await request(server)
                    .post(`/api/v1/${endpoint}`)
                    .send(item)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(403);
            });
            it("should return 401 unauthorized if token is of an non existed user", async () => {
                givenThereAreAnItems();
                givenThereAreAnUser({ admin: true });

                const item = dataCreator.givenAValidNewItem();
                const notExistedUserId = Id.generateId();

                const server = await initServer();

                const res = await request(server)
                    .post(`/api/v1/${endpoint}`)
                    .send(item)
                    .set({ Authorization: `Bearer ${generateToken(notExistedUserId.value)}` });

                expect(res.status).toEqual(401);
            });
            it("should return 400 bad request if body contains invalid field values", async () => {
                givenThereAreAnItems();
                const user = givenThereAreAnUser({ admin: true });
                const item = dataCreator.givenAInvalidNewItem();

                const server = await initServer();

                const res = await request(server)
                    .post(`/api/v1/${endpoint}`)
                    .send(item)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(400);
            });
            it("should return 400 bad request if body does not exist", async () => {
                givenThereAreAnItems();
                const user = givenThereAreAnUser({ admin: true });

                const server = await initServer();

                const res = await request(server)
                    .post(`/api/v1/${endpoint}`)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(400);
            });
            it("should return 409 conflict if already exist a item with the same id", async () => {
                const data = givenThereAreAnItems();
                const user = givenThereAreAnUser({ admin: true });

                const server = await initServer();

                const res = await request(server)
                    .post(`/api/v1/${endpoint}`)
                    .send(data[0])
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(409);
            });
        });
        describe(`PUT /${endpoint}/{id}`, () => {
            it("should upate the item if token is of an admin user", async () => {
                givenThereAreAnItems();
                const item = dataCreator.givenAValidModifiedItem();
                const user = givenThereAreAnUser({ admin: true });

                const server = await initServer();

                const res = await request(server)
                    .put(`/api/v1/${endpoint}/${item.id}`)
                    .send(item)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(200);
                expect(res.body).toEqual({ ok: true, count: 1 });

                const verifyRes = await request(server)
                    .get(`/api/v1/${endpoint}/${item.id}`)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(verifyRes.status).toEqual(200);
                expect(verifyRes.body).toEqual(item);
            });
            it("should return 403 forbidden if token is not of an admin user", async () => {
                givenThereAreAnItems();
                const item = dataCreator.givenAValidModifiedItem();
                const user = givenThereAreAnUser({ admin: false });

                const server = await initServer();

                const res = await request(server)
                    .put(`/api/v1/${endpoint}/${item.id}`)
                    .send(item)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(403);
            });
            it("should return 401 unauthorized if token is of an non existed user", async () => {
                givenThereAreAnItems();
                givenThereAreAnUser({ admin: true });

                const item = dataCreator.givenAValidModifiedItem();
                const notExistedUserId = Id.generateId();

                const server = await initServer();

                const res = await request(server)
                    .put(`/api/v1/${endpoint}/${item.id}`)
                    .send(item)
                    .set({ Authorization: `Bearer ${generateToken(notExistedUserId.value)}` });

                expect(res.status).toEqual(401);
            });
            it("should return 400 bad request if body contains invalid field values", async () => {
                givenThereAreAnItems();
                const user = givenThereAreAnUser({ admin: true });
                const item = dataCreator.givenAInvalidModifiedItem();

                const server = await initServer();

                const res = await request(server)
                    .put(`/api/v1/${endpoint}/${item.id}`)
                    .send(item)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(400);
            });
            it("should return 400 bad request if body does not exist", async () => {
                givenThereAreAnItems();
                const user = givenThereAreAnUser({ admin: true });
                const item = dataCreator.givenAValidModifiedItem();

                const server = await initServer();

                const res = await request(server)
                    .put(`/api/v1/${endpoint}/${item.id}`)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(400);
            });
            it("should return 404 resource not found if it does not exist the item", async () => {
                givenThereAreAnItems();
                const item = dataCreator.givenAValidModifiedItem();
                const user = givenThereAreAnUser({ admin: true });

                const notExistedItemId = Id.generateId();

                const server = await initServer();

                const res = await request(server)
                    .put(`/api/v1/${endpoint}/${notExistedItemId}`)
                    .send(item)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(404);
            });
        });
        describe(`DELETE /${endpoint}/{id}`, () => {
            it("should return 200 removing expected news feed if token is of an admin user", async () => {
                const data = givenThereAreAnItems();
                const user = givenThereAreAnUser({ admin: true });
                const server = await initServer();
                const feedToRemove = data[0];

                const res = await request(server)
                    .delete(`/api/v1/${endpoint}/${feedToRemove.id}`)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(200);

                const resAll = await request(server)
                    .get(`/api/v1/${endpoint}`)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(resAll.body).toEqual(data.filter(feed => feed.id !== feedToRemove.id));
            });
            it("should return 403 forbidden if token is not of an admin user", async () => {
                const data = givenThereAreAnItems();
                const user = givenThereAreAnUser({ admin: false });
                const server = await initServer();

                const res = await request(server)
                    .delete(`/api/v1/${endpoint}/${data[0].id}`)
                    .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

                expect(res.status).toEqual(403);
            });
            it("should return 401 unauthorized if token is of an non existed user", async () => {
                const data = givenThereAreAnItems();
                givenThereAreAnUser({ admin: true });
                const server = await initServer();

                const res = await request(server)
                    .delete(`/api/v1/${endpoint}/${data[0].id}`)
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
