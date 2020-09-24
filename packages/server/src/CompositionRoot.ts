import UserMongoRepository from "./data/users/UserMongoRepository";
import GetUserByUsernameAndPasswordUseCase from "./domain/users/usecases/GetUserByUsernameAndPasswordUseCase";
import GetUserByIdUseCase from "./domain/users/usecases/GetUserByIdUseCase";
import UserController from "./api/users/UserController";
import SettingsMongoRepository from "./data/settings/SettingsMongoRepository";
import GetSettingsUseCase from "./domain/settings/usecases/GetSettingsUseCase";
import GetSocialNewsUseCase from "./domain/socialnews/usecases/GetSocialNewsUseCase";
import SocialNewsTwitterRepository from "./data/socialnews/SocialNewsTwitterRepository";
import CurrentNewsRSSRepository from "./data/currentnews/CurrentNewsRSSRepository";
import GetCurrentNewsUseCase from "./domain/currentnews/usecases/GetCurrentNewsUseCase";
import SocialNewsController from "./api/socialnews/SocialNewsController";
import CurrentNewsController from "./api/currentnews/CurrentNewsController";
import NewsFeedMongoRepository from "./data/newsFeed/NewsFeedMongoRepository";
import NewsFeedsController from "./api/newsFeeds/NewsFeedsController";
import { GetNewsFeedsUseCase } from "./domain/newsFeeds/usecases/GetNewsFeedsUseCase";
import { DIContainer } from "karate-stars-core";
import JwtAuthenticator from "./api/authentication/JwtAuthenticator";

export const names = {
    mongoConnection: "mongoConnection",
    settingsRepository: "settingsRepository",
    newsFeedRepository: "newsFeedRepository",
    userRepository: "userRepository",
    socialNewsRepository: "socialNewsRepository",
    currentNewsRepository: "currentNewsRepository",
};

export const di = DIContainer.getInstance();

export function init() {
    initApp();
    initUser();
    initializeSettings();
    initializeNewsFeeds();
    initializeSocialNews();
    initializeCurrentNews();
}

export function reset() {
    di.clear();
    init();
}

function initApp() {
    const mongoConnection = process.env.MONGO_DB_CONNECTION;

    if (!mongoConnection) {
        throw new Error("Does not exists environment variable for mongo data base connection");
    }

    di.bindLazySingleton(names.mongoConnection, () => mongoConnection);

    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    if (!jwtSecretKey) {
        throw new Error("Does not exists environment variable for jwtSecretKey");
    }

    di.bindLazySingleton(
        JwtAuthenticator,
        () => new JwtAuthenticator(jwtSecretKey, di.get(GetUserByIdUseCase))
    );

    di.bindLazySingleton(names.mongoConnection, () => mongoConnection);
}

function initializeSettings() {
    di.bindLazySingleton(
        names.settingsRepository,
        () => new SettingsMongoRepository(di.get(names.mongoConnection))
    );

    di.bindLazySingleton(
        GetSettingsUseCase,
        () => new GetSettingsUseCase(di.get(names.userRepository))
    );
}

function initUser() {
    di.bindLazySingleton(
        names.userRepository,
        () => new UserMongoRepository(di.get(names.mongoConnection))
    );

    di.bindLazySingleton(
        GetUserByUsernameAndPasswordUseCase,
        () => new GetUserByUsernameAndPasswordUseCase(di.get(names.userRepository))
    );

    di.bindLazySingleton(
        GetUserByIdUseCase,
        () => new GetUserByIdUseCase(di.get(names.userRepository))
    );

    di.bindFactory(
        UserController,
        () =>
            new UserController(
                di.get(JwtAuthenticator),
                di.get(GetUserByUsernameAndPasswordUseCase),
                di.get(GetUserByIdUseCase)
            )
    );
}

function initializeNewsFeeds() {
    di.bindLazySingleton(
        names.newsFeedRepository,
        () => new NewsFeedMongoRepository(di.get(names.mongoConnection))
    );

    di.bindLazySingleton(
        GetNewsFeedsUseCase,
        () =>
            new GetNewsFeedsUseCase(di.get(names.newsFeedRepository), di.get(names.userRepository))
    );

    di.bindFactory(
        NewsFeedsController,
        () => new NewsFeedsController(di.get(JwtAuthenticator), di.get(GetNewsFeedsUseCase))
    );
}

function initializeSocialNews() {
    di.bindLazySingleton(names.socialNewsRepository, () => new SocialNewsTwitterRepository());

    di.bindLazySingleton(
        GetSocialNewsUseCase,
        () =>
            new GetSocialNewsUseCase(
                di.get(names.socialNewsRepository),
                di.get(names.userRepository)
            )
    );

    di.bindFactory(
        SocialNewsController,
        () => new SocialNewsController(di.get(GetSocialNewsUseCase))
    );
}

function initializeCurrentNews() {
    di.bindLazySingleton(names.currentNewsRepository, () => new CurrentNewsRSSRepository());

    di.bindLazySingleton(
        GetCurrentNewsUseCase,
        () =>
            new GetCurrentNewsUseCase(
                di.get(names.currentNewsRepository),
                di.get(names.newsFeedRepository)
            )
    );

    di.bindFactory(
        CurrentNewsController,
        () => new CurrentNewsController(di.get(GetCurrentNewsUseCase))
    );
}
