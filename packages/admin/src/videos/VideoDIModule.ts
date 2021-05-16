import { di, appDIKeys } from "../CompositionRoot";
import VideoApiRepository from "./data/VideoApiRepository";
import { VideoRepository } from "./domain/Boundaries";
import DeleteVideoUseCase from "./domain/DeleteVideoUseCase";
import GetVideoByIdUseCase from "./domain/GetVideoByIdUseCase";
import GetVideosUseCase from "./domain/GetVideosUseCase";
import SaveVideoUseCase from "./domain/SaveVideoUseCase";
import VideoListBloc from "./presentation/video-list/VideoListBloc";

export const videoDIKeys = {
    videoRepository: "videoRepository",
};

export function initVideos() {
    di.bindLazySingleton(
        videoDIKeys.videoRepository,
        () =>
            new VideoApiRepository(
                di.get(appDIKeys.axiosInstanceAPI),
                di.get(appDIKeys.tokenStorage)
            )
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
        SaveVideoUseCase,
        () => new SaveVideoUseCase(di.get<VideoRepository>(videoDIKeys.videoRepository))
    );

    di.bindLazySingleton(
        DeleteVideoUseCase,
        () => new DeleteVideoUseCase(di.get<VideoRepository>(videoDIKeys.videoRepository))
    );

    di.bindFactory(
        VideoListBloc,
        () => new VideoListBloc(di.get(GetVideosUseCase), di.get(DeleteVideoUseCase))
    );

    // di.bindFactory(
    //     NewsFeedDetailBloc,
    //     () => new NewsFeedDetailBloc(di.get(GetNewsFeedByIdUseCase), di.get(SaveNewsFeedUseCase))
    // );
}
