import UserMongoRepository from "./users/data/UserMongoRepository";
import GetUserByUsernameAndPasswordUseCase from "./users/domain/usecases/GetUserByUsernameAndPasswordUseCase";
import GetUserByIdUseCase from "./users/domain/usecases/GetUserByIdUseCase";
import UserController from "./users/api/UserController";
import SettingsMongoRepository from "./settings/data/SettingsMongoRepository";
import GetSettingsUseCase from "./settings/domain/usecases/GetSettingsUseCase";
import { DependencyLocator } from "karate-stars-core";
import JwtDefaultAuthenticator from "./authentication/JwtDefaultAuthenticator";
import { MongoConector } from "./common/data/MongoConector";
import { initializeCategories } from "./categories/CategoryDIModule";
import { initializeCategoryTypes } from "./category-types/CategoryTypeDIModule";
import { initializeCompetitors } from "./competitors/CompetitorDIModule";
import { initializeEventTypes } from "./event-types/EventTypeDIModule";
import { initializeEvents } from "./events/EventDIModule";
import { initializeCountries } from "./countries/CountryDIModule";
import { initializeVideos } from "./videos/VideoDIModule";
import { initializeCurrentNews } from "./currentnews/CurrentNewsDIModule";
import { initializeSocialNews } from "./socialnews/SocialNewsDIModule";
import { initializeNewsFeeds } from "./newsfeeds/NewsFeedsDIModule";

export const appDIKeys = {
    jwtAuthenticator: "jwtAuthenticator",
    settingsRepository: "settingsRepository",
    userRepository: "userRepository",
    imageRepository: "imageRepository",
};

export const di = DependencyLocator.getInstance();

export function init() {
    initApp();
    initUser();
    initializeCategories();
    initializeCategoryTypes();
    initializeCountries();
    initializeEvents();
    initializeEventTypes();
    initializeCompetitors();
    initializeSettings();
    initializeNewsFeeds();
    initializeSocialNews();
    initializeCurrentNews();
    initializeVideos();
}

export function reset() {
    di.clear();
    init();
}

function initApp() {
    di.bindLazySingleton(MongoConector, () => {
        const mongoConnection = process.env.MONGO_DB_CONNECTION;

        if (!mongoConnection) {
            throw new Error("Does not exists environment variable for mongo data base connection");
        }

        return new MongoConector(mongoConnection);
    });

    di.bindLazySingleton(appDIKeys.jwtAuthenticator, () => {
        const jwtSecretKey = process.env.JWT_SECRET_KEY || "";

        return new JwtDefaultAuthenticator(jwtSecretKey, di.get(GetUserByIdUseCase));
    });
}

function initializeSettings() {
    di.bindLazySingleton(
        appDIKeys.settingsRepository,
        () => new SettingsMongoRepository(di.get(MongoConector))
    );

    di.bindLazySingleton(
        GetSettingsUseCase,
        () => new GetSettingsUseCase(di.get(appDIKeys.settingsRepository))
    );
}

function initUser() {
    di.bindLazySingleton(
        appDIKeys.userRepository,
        () => new UserMongoRepository(di.get(MongoConector))
    );

    di.bindLazySingleton(
        GetUserByUsernameAndPasswordUseCase,
        () => new GetUserByUsernameAndPasswordUseCase(di.get(appDIKeys.userRepository))
    );

    di.bindLazySingleton(
        GetUserByIdUseCase,
        () => new GetUserByIdUseCase(di.get(appDIKeys.userRepository))
    );

    di.bindFactory(
        UserController,
        () =>
            new UserController(
                di.get(appDIKeys.jwtAuthenticator),
                di.get(GetUserByUsernameAndPasswordUseCase),
                di.get(GetUserByIdUseCase)
            )
    );
}
