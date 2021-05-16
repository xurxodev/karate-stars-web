import { base64ImageToFile } from "../common/data/Base64ImageConverter";
import { di, appDIKeys } from "../CompositionRoot";
import NewsFeedApiRepository from "./data/NewsFeedApiRepository";
import { NewsFeedRepository } from "./domain/Boundaries";
import DeleteNewsFeedsUseCase from "./domain/DeleteNewsFeedsUseCase";
import GetNewsFeedByIdUseCase from "./domain/GetNewsFeedByIdUseCase";
import GetNewsFeedsUseCase from "./domain/GetNewsFeedsUseCase";
import SaveNewsFeedUseCase from "./domain/SaveNewsFeedUseCase";
import NewsFeedDetailBloc from "./presentation/news-feed-detail/NewsFeedDetailBloc";
import NewsFeedListBloc from "./presentation/news-feed-list/NewsFeedListBloc";

const newsFeedsDIKeys = {
    newsFeedRepository: "newsFeedRepository",
};

export function initNewsFeed() {
    di.bindLazySingleton(
        newsFeedsDIKeys.newsFeedRepository,
        () =>
            new NewsFeedApiRepository(
                di.get(appDIKeys.axiosInstanceAPI),
                di.get(appDIKeys.tokenStorage)
            )
    );

    di.bindLazySingleton(
        GetNewsFeedsUseCase,
        () =>
            new GetNewsFeedsUseCase(di.get<NewsFeedRepository>(newsFeedsDIKeys.newsFeedRepository))
    );

    di.bindLazySingleton(
        GetNewsFeedByIdUseCase,
        () =>
            new GetNewsFeedByIdUseCase(
                di.get<NewsFeedRepository>(newsFeedsDIKeys.newsFeedRepository)
            )
    );

    di.bindLazySingleton(
        SaveNewsFeedUseCase,
        () =>
            new SaveNewsFeedUseCase(
                di.get<NewsFeedRepository>(newsFeedsDIKeys.newsFeedRepository),
                base64ImageToFile
            )
    );

    di.bindLazySingleton(
        DeleteNewsFeedsUseCase,
        () =>
            new DeleteNewsFeedsUseCase(
                di.get<NewsFeedRepository>(newsFeedsDIKeys.newsFeedRepository)
            )
    );

    di.bindFactory(
        NewsFeedListBloc,
        () => new NewsFeedListBloc(di.get(GetNewsFeedsUseCase), di.get(DeleteNewsFeedsUseCase))
    );

    di.bindFactory(
        NewsFeedDetailBloc,
        () => new NewsFeedDetailBloc(di.get(GetNewsFeedByIdUseCase), di.get(SaveNewsFeedUseCase))
    );
}
