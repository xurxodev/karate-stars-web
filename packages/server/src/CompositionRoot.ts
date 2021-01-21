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
import { DependencyLocator } from "karate-stars-core";
import JwtDefaultAuthenticator from "./api/authentication/JwtDefaultAuthenticator";
import { MongoConector } from "./data/common/MongoConector";
import { GetNewsFeedByIdUseCase } from "./domain/newsFeeds/usecases/GetNewsFeedByIdUseCase";
import { DeleteNewsFeedUseCase } from "./domain/newsFeeds/usecases/DeleteNewsFeedUseCase";
import { CreateNewsFeedUseCase } from "./domain/newsFeeds/usecases/CreateNewsFeedUseCase";
import { UpdateNewsFeedUseCase } from "./domain/newsFeeds/usecases/UpdateNewsFeedUseCase";
import { UpdateNewsFeedImageUseCase } from "./domain/newsFeeds/usecases/UpdateNewsFeedImageUseCase";
import { ImageFirebaseStorageRepository } from "./data/images/ImageFirebaseStorageRepository";

export const names = {
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
