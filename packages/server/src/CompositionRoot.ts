import UserMongoRepository from "./users/data/UserMongoRepository";
import GetUserByUsernameAndPasswordUseCase from "./users/domain/usecases/GetUserByUsernameAndPasswordUseCase";
import GetUserByIdUseCase from "./users/domain/usecases/GetUserByIdUseCase";
import UserController from "./users/api/UserController";
import SettingsMongoRepository from "./settings/data/SettingsMongoRepository";
import GetSettingsUseCase from "./settings/domain/usecases/GetSettingsUseCase";
import GetSocialNewsUseCase from "./socialnews/domain/usecases/GetSocialNewsUseCase";
import SocialNewsWebRepository from "./socialnews/data/SocialNewsWebRepository";
import CurrentNewsRSSRepository from "./currentnews/data/CurrentNewsRSSRepository";
import CurrentNewsController from "./currentnews/api/CurrentNewsController";
import NewsFeedMongoRepository from "./newsfeeds/data/NewsFeedMongoRepository";
import { GetNewsFeedsUseCase } from "./newsfeeds/domain/usecases/GetNewsFeedsUseCase";
import { DependencyLocator } from "karate-stars-core";
import JwtDefaultAuthenticator from "./authentication/JwtDefaultAuthenticator";
import { MongoConector } from "./common/data/MongoConector";
import { GetNewsFeedByIdUseCase } from "./newsfeeds/domain/usecases/GetNewsFeedByIdUseCase";
import { DeleteNewsFeedUseCase } from "./newsfeeds/domain/usecases/DeleteNewsFeedUseCase";
import { CreateNewsFeedUseCase } from "./newsfeeds/domain/usecases/CreateNewsFeedUseCase";
import { UpdateNewsFeedUseCase } from "./newsfeeds/domain/usecases/UpdateNewsFeedUseCase";
import { UpdateNewsFeedImageUseCase } from "./newsfeeds/domain/usecases/UpdateNewsFeedImageUseCase";
import { ImageFirebaseStorageRepository } from "./images/data/ImageFirebaseStorageRepository";
import GetCurrentNewsUseCase from "./currentnews/domain/usecases/GetCurrentNewsUseCase";
import NewsFeedsController from "./newsfeeds/api/NewsFeedsController";
import SocialNewsController from "./socialnews/api/SocialNewsController";
import { initializeCategories } from "./categories/CategoryDIModule";
import { initializeCategoryTypes } from "./category-types/CategoryTypeDIModule";
import { initializeCompetitors } from "./competitors/CompetitorDIModule";
import { initializeEventTypes } from "./event-types/EventTypeDIModule";
import { initializeEvents } from "./events/EventDIModule";
import { initializeCountries } from "./countries/CountryDIModule";
import { initializeVideos } from "./videos/VideoDIModule";
import SocialNewsTwitterDataSource from "./socialnews/data/SocialNewsTwitterDataSource";
import SocialNewsInstagramDataSource from "./socialnews/data/SocialNewsInstagramDataSource";

export const appDIKeys = {
    jwtAuthenticator: "jwtAuthenticator",
    settingsRepository: "settingsRepository",
    newsFeedRepository: "newsFeedRepository",
    userRepository: "userRepository",
    socialNewsRepository: "socialNewsRepository",
    currentNewsRepository: "currentNewsRepository",
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

function initializeNewsFeeds() {
    di.bindLazySingleton(
        appDIKeys.newsFeedRepository,
        () => new NewsFeedMongoRepository(di.get(MongoConector))
    );

    di.bindLazySingleton(appDIKeys.imageRepository, () => {
        const bucketName = process.env.FIREBASE_BUCKET_NAME || "";
        const projectId = process.env.FIREBASE_PROJECT_ID || "";
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "";

        //replace fix heroku error: FirebaseAppError: Failed to parse private key: Error: Invalid PEM formatted message.
        const privateKey = (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(/\\n/gu, "\n") || "";

        return new ImageFirebaseStorageRepository(bucketName, {
            projectId,
            clientEmail,
            privateKey,
        });
    });

    di.bindLazySingleton(
        GetNewsFeedsUseCase,
        () =>
            new GetNewsFeedsUseCase(
                di.get(appDIKeys.newsFeedRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        GetNewsFeedByIdUseCase,
        () =>
            new GetNewsFeedByIdUseCase(
                di.get(appDIKeys.newsFeedRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        DeleteNewsFeedUseCase,
        () =>
            new DeleteNewsFeedUseCase(
                di.get(appDIKeys.newsFeedRepository),
                di.get(appDIKeys.userRepository),
                di.get(appDIKeys.imageRepository)
            )
    );

    di.bindLazySingleton(
        CreateNewsFeedUseCase,
        () =>
            new CreateNewsFeedUseCase(
                di.get(appDIKeys.newsFeedRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        UpdateNewsFeedUseCase,
        () =>
            new UpdateNewsFeedUseCase(
                di.get(appDIKeys.newsFeedRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        UpdateNewsFeedImageUseCase,
        () =>
            new UpdateNewsFeedImageUseCase(
                di.get(appDIKeys.newsFeedRepository),
                di.get(appDIKeys.userRepository),
                di.get(appDIKeys.imageRepository)
            )
    );

    di.bindFactory(
        NewsFeedsController,
        () =>
            new NewsFeedsController(
                di.get(appDIKeys.jwtAuthenticator),
                di.get(GetNewsFeedsUseCase),
                di.get(GetNewsFeedByIdUseCase),
                di.get(CreateNewsFeedUseCase),
                di.get(UpdateNewsFeedUseCase),
                di.get(UpdateNewsFeedImageUseCase),
                di.get(DeleteNewsFeedUseCase)
            )
    );
}

function initializeSocialNews() {
    di.bindLazySingleton(appDIKeys.socialNewsRepository, () => {
        const consumerkey = process.env.TWITTER_CONSUMER_KEY_PROP || "";
        const consumer_secret = process.env.TWITTER_CONSUMER_SECRET_PROP || "";

        const twitter = new SocialNewsTwitterDataSource(consumerkey, consumer_secret);
        const instagram = new SocialNewsInstagramDataSource();

        return new SocialNewsWebRepository(twitter, instagram);
    });

    di.bindLazySingleton(
        GetSocialNewsUseCase,
        () =>
            new GetSocialNewsUseCase(
                di.get(appDIKeys.socialNewsRepository),
                di.get(appDIKeys.settingsRepository)
            )
    );

    di.bindFactory(
        SocialNewsController,
        () => new SocialNewsController(di.get(GetSocialNewsUseCase))
    );
}

function initializeCurrentNews() {
    di.bindLazySingleton(appDIKeys.currentNewsRepository, () => new CurrentNewsRSSRepository());

    di.bindLazySingleton(
        GetCurrentNewsUseCase,
        () =>
            new GetCurrentNewsUseCase(
                di.get(appDIKeys.currentNewsRepository),
                di.get(appDIKeys.newsFeedRepository)
            )
    );

    di.bindFactory(
        CurrentNewsController,
        () => new CurrentNewsController(di.get(GetCurrentNewsUseCase))
    );
}
