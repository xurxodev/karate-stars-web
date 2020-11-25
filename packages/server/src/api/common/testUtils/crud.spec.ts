import { Email, Entity, EntityData, EntityRawData, Id, Password, User } from "karate-stars-core";
import request from "supertest";
import * as CompositionRoot from "../../../CompositionRoot";
import { initServer, generateToken } from "./serverTest";
import { FakeGenericRepository } from "./FakeGenericRepository";
import { FakeUserRepository } from "./FakeUserRepository";

export const commonCRUDTests =
    <Data extends EntityData, RawData extends EntityRawData, T extends Entity<Data, RawData>>(
        endpoint: string, repositoryKey: string, initialItems: T[]) => {

        const givenThereAreAnItems = () => {
            CompositionRoot.di.bindLazySingleton(
                repositoryKey,
                () => new FakeGenericRepository<Data, RawData, T>(initialItems)
            );

            return initialItems.map(feed => feed.toRawData());
        }

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
                CompositionRoot.names.userRepository,
                () => new FakeUserRepository([user])
            );

            return user;
        }

        describe(`CRUD tests for ${endpoint}`, () => {
            describe(`GET /${endpoint}`, () => {
                it("should return expected news feeds if token is of an admin user", async () => {
                    const data = givenThereAreAnItems();
                    const user = givenThereAreAnUser({ admin: true });

                    const server = await initServer();

                    const res = await request(server)
                        .get(`/api/v1/${endpoint}`)
                        .set({ Authorization: `Bearer ${generateToken(user.id)}` });

                    expect(res.status).toEqual(200);
                    expect(res.body).toEqual(data);
                });
                it("should return 403 forbidden if token is not of an admin user", async () => {
                    givenThereAreAnItems();
                    const user = givenThereAreAnUser({ admin: false });

                    const server = await initServer();

                    const res = await request(server)
                        .get(`/api/v1/${endpoint}`)
                        .set({ Authorization: `Bearer ${generateToken(user.id)}` });

                    expect(res.status).toEqual(403);
                });
                it("should return 401 unauthorized if token is of an non existed user", async () => {
                    givenThereAreAnItems();
                    givenThereAreAnUser({ admin: true });

                    const server = await initServer();

                    const res = await request(server)
                        .get(`/api/v1/${endpoint}`)
                        .set({ Authorization: `Bearer ${generateToken(Id.generateId())}` });

                    expect(res.status).toEqual(401);
                });
            });
            describe("GET /news-feeds/{id}", () => {
                it("should return expected news feed if token is of an admin user", async () => {
                    const data = givenThereAreAnItems();
                    const user = givenThereAreAnUser({ admin: true });

                    const server = await initServer();

                    const res = await request(server)
                        .get(`/api/v1/${endpoint}/${data[0].id}`)
                        .set({ Authorization: `Bearer ${generateToken(user.id)}` });

                    expect(res.status).toEqual(200);
                    expect(res.body).toEqual(data[0]);
                });
                it("should return 403 forbidden if token is not of an admin user", async () => {
                    const data = givenThereAreAnItems();
                    const user = givenThereAreAnUser({ admin: false });

                    const server = await initServer();

                    const res = await request(server)
                        .get(`/api/v1/${endpoint}/${data[0].id}`)
                        .set({ Authorization: `Bearer ${generateToken(user.id)}` });

                    expect(res.status).toEqual(403);
                });
                it("should return 401 unauthorized if token is of an non existed user", async () => {
                    const data = givenThereAreAnItems();
                    givenThereAreAnUser({ admin: true });

                    const server = await initServer();

                    const res = await request(server)
                        .get(`/api/v1/${endpoint}/${data[0].id}`)
                        .set({ Authorization: `Bearer ${generateToken(Id.generateId())}` });

                    expect(res.status).toEqual(401);
                });
            });
            describe("DELETE /news-feeds/{id}", () => {
                it("should return 200 removing expected news feed if token is of an admin user", async () => {
                    const data = givenThereAreAnItems();
                    const user = givenThereAreAnUser({ admin: true });
                    const server = await initServer();
                    const feedToRemove = data[0];

                    const res = await request(server)
                        .delete(`/api/v1/${endpoint}/${feedToRemove.id}`)
                        .set({ Authorization: `Bearer ${generateToken(user.id)}` });

                    expect(res.status).toEqual(200);

                    const resAll = await request(server)
                        .get("/api/v1/news-feeds")
                        .set({ Authorization: `Bearer ${generateToken(user.id)}` });

                    expect(resAll.body).toEqual(data.filter(feed => feed.id !== feedToRemove.id));
                });
                it("should return 403 forbidden if token is not of an admin user", async () => {
                    const data = givenThereAreAnItems();
                    const user = givenThereAreAnUser({ admin: false });
                    const server = await initServer();

                    const res = await request(server)
                        .delete(`/api/v1/${endpoint}/${data[0].id}`)
                        .set({ Authorization: `Bearer ${generateToken(user.id)}` });

                    expect(res.status).toEqual(403);
                });
                it("should return 401 unauthorized if token is of an non existed user", async () => {
                    const data = givenThereAreAnItems();
                    givenThereAreAnUser({ admin: true });
                    const server = await initServer();

                    const res = await request(server)
                        .delete(`/api/v1/${endpoint}/${data[0].id}`)
                        .set({ Authorization: `Bearer ${generateToken(Id.generateId())}` });

                    expect(res.status).toEqual(401);
                });
            });

        });
    }

// just to avoid warning, that no tests in test file
describe('Common tests for CRUD routes', () => {
    test('should be used per implementation', () => { });
});


