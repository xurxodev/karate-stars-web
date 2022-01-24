import { MongoConector } from "../common/data/MongoConector";
import { appDIKeys, di } from "../CompositionRoot";
import { ImageFirebaseStorageRepository } from "../images/data/ImageFirebaseStorageRepository";
import NewsFeedsController from "./api/NewsFeedsController";
import NewsFeedMongoRepository from "./data/NewsFeedMongoRepository";
import { CreateNewsFeedUseCase } from "./domain/usecases/CreateNewsFeedUseCase";
import { DeleteNewsFeedUseCase } from "./domain/usecases/DeleteNewsFeedUseCase";
import { GetNewsFeedByIdUseCase } from "./domain/usecases/GetNewsFeedByIdUseCase";
import { GetNewsFeedsUseCase } from "./domain/usecases/GetNewsFeedsUseCase";
import { UpdateNewsFeedImageUseCase } from "./domain/usecases/UpdateNewsFeedImageUseCase";
import { UpdateNewsFeedUseCase } from "./domain/usecases/UpdateNewsFeedUseCase";

export const newsFeedDIKeys = {
    newsFeedRepository: "newsFeedRepository",
};

export function initializeNewsFeeds() {
    di.bindLazySingleton(
        newsFeedDIKeys.newsFeedRepository,
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
                di.get(newsFeedDIKeys.newsFeedRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        GetNewsFeedByIdUseCase,
        () =>
            new GetNewsFeedByIdUseCase(
                di.get(newsFeedDIKeys.newsFeedRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        DeleteNewsFeedUseCase,
        () =>
            new DeleteNewsFeedUseCase(
                di.get(newsFeedDIKeys.newsFeedRepository),
                di.get(appDIKeys.userRepository),
                di.get(appDIKeys.imageRepository)
            )
    );

    di.bindLazySingleton(
        CreateNewsFeedUseCase,
        () =>
            new CreateNewsFeedUseCase(
                di.get(newsFeedDIKeys.newsFeedRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        UpdateNewsFeedUseCase,
        () =>
            new UpdateNewsFeedUseCase(
                di.get(newsFeedDIKeys.newsFeedRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        UpdateNewsFeedImageUseCase,
        () =>
            new UpdateNewsFeedImageUseCase(
                di.get(newsFeedDIKeys.newsFeedRepository),
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
