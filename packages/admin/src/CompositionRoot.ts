import LoginBloc from "./user/presentation/LoginBloc";
import LoginUseCase from "./user/domain/LoginUseCase";
import UserApiRepository from "./user/data/UserApiRepository";
import axios from "axios";
import { TokenLocalStorage } from "./common/data/TokenLocalStorage";
import GetCurrentUserUseCase from "./user/domain/GetCurrentUserUseCase";
import AppBloc from "./app/AppBloc";
import RemoveCurrentUserUseCase from "./user/domain/RemoveCurrentUserUseCase";
import SendPushNotificationBloc from "./notifications/presentation/SendPushNotificationBloc";
import FcmPushNotificationRepository from "./notifications/data/FcmPushNotificationRepository";
import SendPushNotificationUseCase from "./notifications/domain/SendPushNotificationUseCase";
import NewsFeedDetailBloc from "./news/presentation/news-feed-detail/NewsFeedDetailBloc";
import { DependencyLocator } from "karate-stars-core";
import NewsFeedListBloc from "./news/presentation/news-feed-list/NewsFeedListBloc";
import NewsFeedApiRepository from "./news/data/NewsFeedApiRepository";
import { NewsFeedRepository } from "./news/domain/Boundaries";
import UserRepository from "./user/domain/Boundaries";
import GetNewsFeedsUseCase from "./news/domain/GetNewsFeedsUseCase";
import DeleteNewsFeedsUseCase from "./news/domain/DeleteNewsFeedsUseCase";
import GetNewsFeedByIdUseCase from "./news/domain/GetNewsFeedByIdUseCase";
import { base64ImageToFile } from "./common/data/Base64ImageConverter";
import SaveNewsFeedUseCase from "./news/domain/SaveNewsFeedUseCase";
import CompetitorApiRepository from "./competitors/data/CompetitorApiRepository";
import GetCompetitorsUseCase from "./competitors/domain/GetCompetitorsUseCase";
import { CompetitorRepository } from "./competitors/domain/Boundaries";
import GetCompetitorByIdUseCase from "./competitors/domain/GetCompetitorByIdUseCase";
import CompetitorListBloc from "./competitors/presentation/compeltitor-list/CompetitorListBloc";
import DeleteCompetitorUseCase from "./competitors/domain/DeleteCompetitorUseCase";
import SaveCompetitorUseCase from "./competitors/domain/SaveCompetitorUseCase";

export const names = {
    axiosInstanceAPI: "axiosInstanceAPI",
    axiosInstancePush: "axiosInstancePush",
    userRepository: "userRepository",
    newsFeedRepository: "newsFeedRepository",
    competitorRepository: "competitorRepository",
    pushNotificationRepository: "pushNotificationRepository",
    tokenStorage: "tokenStorage",
};

export const di = DependencyLocator.getInstance();

export function init() {
    initApp();
    initLogin();
    initSendPushNotifications();
    initNewsFeed();
    initCompetitors();
}

export function reset() {
    di.clear();
    init();
}

function initApp() {
    di.bindLazySingleton(names.axiosInstanceAPI, () =>
        axios.create({
            baseURL: "/api/v1/",
        })
    );

    di.bindLazySingleton(names.tokenStorage, () => new TokenLocalStorage());

    di.bindLazySingleton(
        names.userRepository,
        () => new UserApiRepository(di.get(names.axiosInstanceAPI), di.get(names.tokenStorage))
    );
    di.bindLazySingleton(
        GetCurrentUserUseCase,
        () => new GetCurrentUserUseCase(di.get<UserRepository>(names.userRepository))
    );
    di.bindLazySingleton(
        RemoveCurrentUserUseCase,
        () => new RemoveCurrentUserUseCase(di.get<UserRepository>(names.userRepository))
    );

    di.bindFactory(
        AppBloc,
        () => new AppBloc(di.get(GetCurrentUserUseCase), di.get(RemoveCurrentUserUseCase))
    );
}

function initLogin() {
    di.bindLazySingleton(LoginUseCase, () => new LoginUseCase(di.get(names.userRepository)));
    di.bindFactory(LoginBloc, () => new LoginBloc(di.get(LoginUseCase)));
}

function initSendPushNotifications() {
    di.bindLazySingleton(names.axiosInstancePush, () =>
        axios.create({
            baseURL: "https://fcm.googleapis.com/fcm",
        })
    );

    const fcmApiToken = process.env.REACT_APP_FCM_API_TOKEN || "";

    di.bindLazySingleton(
        names.pushNotificationRepository,
        () => new FcmPushNotificationRepository(di.get(names.axiosInstancePush), fcmApiToken)
    );

    di.bindLazySingleton(
        SendPushNotificationUseCase,
        () => new SendPushNotificationUseCase(di.get(names.pushNotificationRepository))
    );

    di.bindFactory(
        SendPushNotificationBloc,
        () => new SendPushNotificationBloc(di.get(SendPushNotificationUseCase))
    );
}

function initNewsFeed() {
    di.bindLazySingleton(
        names.newsFeedRepository,
        () => new NewsFeedApiRepository(di.get(names.axiosInstanceAPI), di.get(names.tokenStorage))
    );

    di.bindLazySingleton(
        GetNewsFeedsUseCase,
        () => new GetNewsFeedsUseCase(di.get<NewsFeedRepository>(names.newsFeedRepository))
    );

    di.bindLazySingleton(
        GetNewsFeedByIdUseCase,
        () => new GetNewsFeedByIdUseCase(di.get<NewsFeedRepository>(names.newsFeedRepository))
    );

    di.bindLazySingleton(
        SaveNewsFeedUseCase,
        () =>
            new SaveNewsFeedUseCase(
                di.get<NewsFeedRepository>(names.newsFeedRepository),
                base64ImageToFile
            )
    );

    di.bindLazySingleton(
        DeleteNewsFeedsUseCase,
        () => new DeleteNewsFeedsUseCase(di.get<NewsFeedRepository>(names.newsFeedRepository))
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

function initCompetitors() {
    di.bindLazySingleton(
        names.competitorRepository,
        () =>
            new CompetitorApiRepository(di.get(names.axiosInstanceAPI), di.get(names.tokenStorage))
    );

    di.bindLazySingleton(
        GetCompetitorsUseCase,
        () => new GetCompetitorsUseCase(di.get<CompetitorRepository>(names.competitorRepository))
    );

    di.bindLazySingleton(
        GetCompetitorByIdUseCase,
        () => new GetCompetitorByIdUseCase(di.get<CompetitorRepository>(names.competitorRepository))
    );

    di.bindLazySingleton(
        SaveCompetitorUseCase,
        () =>
            new SaveCompetitorUseCase(
                di.get<CompetitorRepository>(names.competitorRepository),
                base64ImageToFile
            )
    );

    di.bindLazySingleton(
        DeleteCompetitorUseCase,
        () => new DeleteCompetitorUseCase(di.get<CompetitorRepository>(names.competitorRepository))
    );

    di.bindFactory(
        CompetitorListBloc,
        () => new CompetitorListBloc(di.get(GetCompetitorsUseCase), di.get(DeleteCompetitorUseCase))
    );

    // di.bindFactory(
    //     NewsFeedDetailBloc,
    //     () => new NewsFeedDetailBloc(di.get(GetNewsFeedByIdUseCase), di.get(SaveNewsFeedUseCase))
    // );
}
