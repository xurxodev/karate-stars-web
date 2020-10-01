import { Email, Id, Maybe, Password, User } from "karate-stars-core";
import request from "supertest";
import * as CompositionRoot from "../../../CompositionRoot";
import NewsFeedRepository from "../../../domain/newsFeeds/boundaries/NewsFeedRepository";
import UserRepository from "../../../domain/users/boundaries/UserRepository";
import { initServer, generateToken } from "../../common/testUtils/serverTest";

describe("NewsFeedRoutes", () => {
    it("should return expected news feeds if token is of an admin user", async () => {
        const newsFeeds = givenThereAreANewsFeeds();
        const user = givenThereAreAUser({ admin: true });

        const server = await initServer();

        const res = await request(server)
            .get("/api/v1/news-feeds")
            .set({ Authorization: `Bearer ${generateToken(user.id)}` });

        expect(res.status).toEqual(200);
        expect(res.body).toEqual(newsFeeds);
    });
    it("should return 403 forbidden if token is not of an admin user", async () => {
        givenThereAreANewsFeeds();
        const user = givenThereAreAUser({ admin: false });

        const server = await initServer();

        const res = await request(server)
            .get("/api/v1/news-feeds")
            .set({ Authorization: `Bearer ${generateToken(user.id)}` });

        expect(res.status).toEqual(403);
    });
});

function givenThereAreANewsFeeds() {
    const newsFeed = [];

    const stubRepository: NewsFeedRepository = {
        getAll: jest.fn().mockImplementation(() => {
            return newsFeed;
        }),
    };

    CompositionRoot.di.bindLazySingleton(
        CompositionRoot.names.newsFeedRepository,
        () => stubRepository
    );

    return newsFeed;
}

function givenThereAreAUser(params: { admin: boolean }): User {
    const user: User = User.createExisted({
        id: Id.generateId(),
        name: "Example user",
        image: "https://pbs.twimg.com/profile_images/1151113544362078209/chgA6VO9_400x400.jpg",
        email: Email.create("info@karatestarsapp.com").get(),
        password: Password.create("password").get(),
        isAdmin: params.admin,
        isClientUser: true,
    });

    const stubRepository: UserRepository = {
        getByUsernameAndPassword: jest.fn().mockImplementation(() => {
            return Maybe.fromValue(user);
        }),
        getByUserId: jest.fn().mockImplementation(() => {
            return Maybe.fromValue(user);
        }),
    };

    CompositionRoot.di.bindLazySingleton(
        CompositionRoot.names.userRepository,
        () => stubRepository
    );

    return user;
}
