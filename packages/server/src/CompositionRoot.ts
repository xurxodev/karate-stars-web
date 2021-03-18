import UserMongoRepository from "./users/data/UserMongoRepository";
import GetUserByUsernameAndPasswordUseCase from "./users/domain/usecases/GetUserByUsernameAndPasswordUseCase";
import GetUserByIdUseCase from "./users/domain/usecases/GetUserByIdUseCase";
import UserController from "./users/api/UserController";
import SettingsMongoRepository from "./settings/data/SettingsMongoRepository";
import GetSettingsUseCase from "./settings/domain/usecases/GetSettingsUseCase";
import GetSocialNewsUseCase from "./socialnews/domain/usecases/GetSocialNewsUseCase";
import SocialNewsTwitterRepository from "./socialnews/data/SocialNewsTwitterRepository";
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
import EventTypeMongoRepository from "./event-types/data/EventTypeMongoRepository";
import { GetEventTypesUseCase } from "./event-types/domain/usecases/GetEventTypesUseCase";
import { EventTypeController } from "./event-types/api/EventTypeController";
import { GetEventTypeByIdUseCase } from "./event-types/domain/usecases/GetEventTypeByIdUseCase";
import { CreateEventTypeUseCase } from "./event-types/domain/usecases/CreateEventTypeUseCase";
import { UpdateEventTypeUseCase } from "./event-types/domain/usecases/UpdateEventTypeUseCase";
import { DeleteEventTypeUseCase } from "./event-types/domain/usecases/DeleteEventTypeUseCase";

export const names = {
    jwtAuthenticator: "jwtAuthenticator",
    settingsRepository: "settingsRepository",
    newsFeedRepository: "newsFeedRepository",
    eventTypeRepository: "eventTypeRepository",
    userRepository: "userRepository",
    socialNewsRepository: "socialNewsRepository",
    currentNewsRepository: "currentNewsRepository",
    imageRepository: "imageRepository",
};

export const di = DependencyLocator.getInstance();

export function init() {
    initApp();
    initUser();
    initializeSettings();
    initializeNewsFeeds();
    initializeEventTypes();
    initializeSocialNews();
    initializeCurrentNews();
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

    di.bindLazySingleton(names.jwtAuthenticator, () => {
        const jwtSecretKey = process.env.JWT_SECRET_KEY || "";

        return new JwtDefaultAuthenticator(jwtSecretKey, di.get(GetUserByIdUseCase));
    });
}

function initializeSettings() {
    di.bindLazySingleton(
        names.settingsRepository,
        () => new SettingsMongoRepository(di.get(MongoConector))
    );

    di.bindLazySingleton(
        GetSettingsUseCase,
        () => new GetSettingsUseCase(di.get(names.settingsRepository))
    );
}

function initUser() {
    di.bindLazySingleton(
        names.userRepository,
        () => new UserMongoRepository(di.get(MongoConector))
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
                di.get(names.jwtAuthenticator),
                di.get(GetUserByUsernameAndPasswordUseCase),
                di.get(GetUserByIdUseCase)
            )
    );
}

function initializeNewsFeeds() {
    di.bindLazySingleton(
        names.newsFeedRepository,
        () => new NewsFeedMongoRepository(di.get(MongoConector))
    );

    di.bindLazySingleton(names.imageRepository, () => {
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
            new GetNewsFeedsUseCase(di.get(names.newsFeedRepository), di.get(names.userRepository))
    );

    di.bindLazySingleton(
        GetNewsFeedByIdUseCase,
        () =>
            new GetNewsFeedByIdUseCase(
                di.get(names.newsFeedRepository),
                di.get(names.userRepository)
            )
    );

    di.bindLazySingleton(
        DeleteNewsFeedUseCase,
        () =>
            new DeleteNewsFeedUseCase(
                di.get(names.newsFeedRepository),
                di.get(names.userRepository),
                di.get(names.imageRepository)
            )
    );

    di.bindLazySingleton(
        CreateNewsFeedUseCase,
        () =>
            new CreateNewsFeedUseCase(
                di.get(names.newsFeedRepository),
                di.get(names.userRepository)
            )
    );

    di.bindLazySingleton(
        UpdateNewsFeedUseCase,
        () =>
            new UpdateNewsFeedUseCase(
                di.get(names.newsFeedRepository),
                di.get(names.userRepository)
            )
    );

    di.bindLazySingleton(
        UpdateNewsFeedImageUseCase,
        () =>
            new UpdateNewsFeedImageUseCase(
                di.get(names.newsFeedRepository),
                di.get(names.userRepository),
                di.get(names.imageRepository)
            )
    );

    di.bindFactory(
        NewsFeedsController,
        () =>
            new NewsFeedsController(
                di.get(names.jwtAuthenticator),
                di.get(GetNewsFeedsUseCase),
                di.get(GetNewsFeedByIdUseCase),
                di.get(CreateNewsFeedUseCase),
                di.get(UpdateNewsFeedUseCase),
                di.get(UpdateNewsFeedImageUseCase),
                di.get(DeleteNewsFeedUseCase)
            )
    );
}

function initializeEventTypes() {
    di.bindLazySingleton(
        names.eventTypeRepository,
        () => new EventTypeMongoRepository(di.get(MongoConector))
    );

    di.bindLazySingleton(
        GetEventTypesUseCase,
        () =>
            new GetEventTypesUseCase(
                di.get(names.eventTypeRepository),
                di.get(names.userRepository)
            )
    );

    di.bindLazySingleton(
        GetEventTypeByIdUseCase,
        () =>
            new GetEventTypeByIdUseCase(
                di.get(names.eventTypeRepository),
                di.get(names.userRepository)
            )
    );

    di.bindLazySingleton(
        CreateEventTypeUseCase,
        () =>
            new CreateEventTypeUseCase(
                di.get(names.eventTypeRepository),
                di.get(names.userRepository)
            )
    );

    di.bindLazySingleton(
        UpdateEventTypeUseCase,
        () =>
            new UpdateEventTypeUseCase(
                di.get(names.eventTypeRepository),
                di.get(names.userRepository)
            )
    );

    di.bindLazySingleton(
        DeleteEventTypeUseCase,
        () =>
            new DeleteEventTypeUseCase(
                di.get(names.eventTypeRepository),
                di.get(names.userRepository)
            )
    );

    di.bindFactory(
        EventTypeController,
        () =>
            new EventTypeController(
                di.get(names.jwtAuthenticator),
                di.get(GetEventTypesUseCase),
                di.get(GetEventTypeByIdUseCase),
                di.get(CreateEventTypeUseCase),
                di.get(UpdateEventTypeUseCase),
                di.get(DeleteEventTypeUseCase)
            )
    );
}

function initializeSocialNews() {
    di.bindLazySingleton(names.socialNewsRepository, () => {
        const consumerkey = process.env.TWITTER_CONSUMER_KEY_PROP || "";
        const consumer_secret = process.env.TWITTER_CONSUMER_SECRET_PROP || "";

        return new SocialNewsTwitterRepository(consumerkey, consumer_secret);
    });

    di.bindLazySingleton(
        GetSocialNewsUseCase,
        () =>
            new GetSocialNewsUseCase(
                di.get(names.socialNewsRepository),
                di.get(names.settingsRepository)
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
