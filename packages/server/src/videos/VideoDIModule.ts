import { MongoConector } from "../common/data/MongoConector";
import { appDIKeys, di } from "../CompositionRoot";
import UserRepository from "../users/domain/boundaries/UserRepository";
import { VideoController } from "./api/VideoController";
import VideoMongoRepository from "./data/VideoMongoRepository";
import VideoRepository from "./domain/boundaries/VideoRepository";
import { CreateVideoUseCase } from "./domain/usecases/CreateVideoUseCase";
import { DeleteVideoUseCase } from "./domain/usecases/DeleteVideoUseCase";
import { GetVideosUseCase } from "./domain/usecases/GetVideosUseCase";
import { GetVideoByIdUseCase } from "./domain/usecases/GetVideoByIdUseCase";
import { UpdateVideoUseCase } from "./domain/usecases/UpdateVideoUseCase";
import CompetitorRepository from "../competitors/domain/boundaries/CompetitorRepository";
import { competitorDIKeys } from "../competitors/CompetitorDIModule";

export const videoDIKeys = {
    videoRepository: "videoRepository",
};

export function initializeVideos() {
    di.bindLazySingleton(
        videoDIKeys.videoRepository,
        () => new VideoMongoRepository(di.get(MongoConector))
    );

    di.bindLazySingleton(
        GetVideosUseCase,
        () => new GetVideosUseCase(di.get<VideoRepository>(videoDIKeys.videoRepository))
    );

    di.bindLazySingleton(
        GetVideoByIdUseCase,
        () => new GetVideoByIdUseCase(di.get<VideoRepository>(videoDIKeys.videoRepository))
    );

    di.bindLazySingleton(
        CreateVideoUseCase,
        () =>
            new CreateVideoUseCase(
                di.get<VideoRepository>(videoDIKeys.videoRepository),
                di.get<CompetitorRepository>(competitorDIKeys.CompetitorRepository),
                di.get<UserRepository>(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        UpdateVideoUseCase,
        () =>
            new UpdateVideoUseCase(
                di.get<VideoRepository>(videoDIKeys.videoRepository),
                di.get<CompetitorRepository>(competitorDIKeys.CompetitorRepository),
                di.get<UserRepository>(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        DeleteVideoUseCase,
        () =>
            new DeleteVideoUseCase(
                di.get<VideoRepository>(videoDIKeys.videoRepository),
                di.get<UserRepository>(appDIKeys.userRepository)
            )
    );

    di.bindFactory(
        VideoController,
        () =>
            new VideoController(
                di.get(appDIKeys.jwtAuthenticator),
                di.get(GetVideosUseCase),
                di.get(GetVideoByIdUseCase),
                di.get(CreateVideoUseCase),
                di.get(UpdateVideoUseCase),
                di.get(DeleteVideoUseCase)
            )
    );
}
