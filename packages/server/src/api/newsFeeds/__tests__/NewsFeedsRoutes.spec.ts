import { Email, Id, NewsFeed, Password, User } from "karate-stars-core";
import request from "supertest";
import * as CompositionRoot from "../../../CompositionRoot";
import { initServer, generateToken } from "../../common/testUtils/serverTest";
import { FakeGenericRepository } from "../../common/testUtils/FakeGenericRepository";
import { FakeUserRepository } from "../../common/testUtils/FakeUserRepository";

describe("NewsFeedRoutes", () => {
    describe("GET /news-feeds", () => {
        it("should return expected news feeds if token is of an admin user", async () => {
            const newsFeeds = givenThereAreANewsFeeds();
            const user = givenThereAreAnUser({ admin: true });

            const server = await initServer();

            const res = await request(server)
                .get("/api/v1/news-feeds")
                .set({ Authorization: `Bearer ${generateToken(user.id)}` });

            expect(res.status).toEqual(200);
            expect(res.body).toEqual(newsFeeds);
        });
        it("should return 403 forbidden if token is not of an admin user", async () => {
            givenThereAreANewsFeeds();
            const user = givenThereAreAnUser({ admin: false });

            const server = await initServer();

            const res = await request(server)
                .get("/api/v1/news-feeds")
                .set({ Authorization: `Bearer ${generateToken(user.id)}` });

            expect(res.status).toEqual(403);
        });
        it("should return 401 unauthorized if token is of an non existed user", async () => {
            givenThereAreANewsFeeds();
            givenThereAreAnUser({ admin: true });

            const server = await initServer();

            const res = await request(server)
                .get("/api/v1/news-feeds")
                .set({ Authorization: `Bearer ${generateToken(Id.generateId())}` });

            expect(res.status).toEqual(401);
        });
    });
    describe("GET /news-feeds/{id}", () => {
        it("should return expected news feed if token is of an admin user", async () => {
            const newsFeeds = givenThereAreANewsFeeds();
            const user = givenThereAreAnUser({ admin: true });

            const server = await initServer();

            const res = await request(server)
                .get(`/api/v1/news-feeds/${newsFeeds[0].id}`)
                .set({ Authorization: `Bearer ${generateToken(user.id)}` });

            expect(res.status).toEqual(200);
            expect(res.body).toEqual(newsFeeds[0]);
        });
        it("should return 403 forbidden if token is not of an admin user", async () => {
            const newsFeeds = givenThereAreANewsFeeds();
            const user = givenThereAreAnUser({ admin: false });

            const server = await initServer();

            const res = await request(server)
                .get(`/api/v1/news-feeds/${newsFeeds[0].id}`)
                .set({ Authorization: `Bearer ${generateToken(user.id)}` });

            expect(res.status).toEqual(403);
        });
        it("should return 401 unauthorized if token is of an non existed user", async () => {
            const newsFeeds = givenThereAreANewsFeeds();
            givenThereAreAnUser({ admin: true });

            const server = await initServer();

            const res = await request(server)
                .get(`/api/v1/news-feeds/${newsFeeds[0].id}`)
                .set({ Authorization: `Bearer ${generateToken(Id.generateId())}` });

            expect(res.status).toEqual(401);
        });
    });
    describe("DELETE /news-feeds/{id}", () => {
        it("should return 200 removing expected news feed if token is of an admin user", async () => {
            const newsFeeds = givenThereAreANewsFeeds();
            const user = givenThereAreAnUser({ admin: true });
            const server = await initServer();
            const feedToRemove = newsFeeds[0];

            const res = await request(server)
                .delete(`/api/v1/news-feeds/${feedToRemove.id}`)
                .set({ Authorization: `Bearer ${generateToken(user.id)}` });

            expect(res.status).toEqual(200);

            const resAll = await request(server)
                .get("/api/v1/news-feeds")
                .set({ Authorization: `Bearer ${generateToken(user.id)}` });

            expect(resAll.body).toEqual(newsFeeds.filter(feed => feed.id !== feedToRemove.id));
        });
        it("should return 403 forbidden if token is not of an admin user", async () => {
            const newsFeeds = givenThereAreANewsFeeds();
            const user = givenThereAreAnUser({ admin: false });
            const server = await initServer();

            const res = await request(server)
                .delete(`/api/v1/news-feeds/${newsFeeds[0].id}`)
                .set({ Authorization: `Bearer ${generateToken(user.id)}` });

            expect(res.status).toEqual(403);
        });
        it("should return 401 unauthorized if token is of an non existed user", async () => {
            const newsFeeds = givenThereAreANewsFeeds();
            givenThereAreAnUser({ admin: true });
            const server = await initServer();

            const res = await request(server)
                .delete(`/api/v1/news-feeds/${newsFeeds[0].id}`)
                .set({ Authorization: `Bearer ${generateToken(Id.generateId())}` });

            expect(res.status).toEqual(401);
        });
    });
});

function givenThereAreANewsFeeds() {
    const newsFeeds = [
        NewsFeed.create({
            id: Id.generateId().value,
            name: "WKF News Center",
            url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567777611407.xml",
            language: "en",
            type: "rss",
            image:
                "https://firebasestorage.googleapis.com/v0/b/karatestars-1261.appspot.com/o/feeds%2Fwkf.png?alt=media",
        }).get(),
        NewsFeed.create({
            id: Id.generateId().value,
            name: "Inside The Games",
            url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567627850382.xml",
            language: "en",
            type: "rss",
            image:
                "https://firebasestorage.googleapis.com/v0/b/karatestars-1261.appspot.com/o/feeds%2Finside_the_games.gif?alt=media",
        }).get(),
    ];

    CompositionRoot.di.bindLazySingleton(
        CompositionRoot.names.newsFeedRepository,
        () => new FakeGenericRepository<NewsFeed>(newsFeeds)
    );

    return newsFeeds.map(feed => feed.toRawData());
}

function givenThereAreAnUser(params: { admin: boolean }): User {
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
