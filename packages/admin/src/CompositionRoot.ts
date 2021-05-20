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
import { DependencyLocator } from "karate-stars-core";
import UserRepository from "./user/domain/Boundaries";
import { initCompetitors } from "./competitors/CompetitorDIModule";
import { initNewsFeed } from "./news/NewsDIModule";
import { initVideos } from "./videos/VideoDIModule";
import { initEvents } from "./events/EventDIModule";
import { initEventTypes } from "./event-types/EventTypeDIModule";
import { initCategoryTypes } from "./category-types/CategoryTypeDIModule";

export const appDIKeys = {
    axiosInstanceAPI: "axiosInstanceAPI",
    axiosInstancePush: "axiosInstancePush",
    userRepository: "userRepository",
    pushNotificationRepository: "pushNotificationRepository",
    tokenStorage: "tokenStorage",
};

export const di = DependencyLocator.getInstance();

export function init() {
    initApp();
    initLogin();
    initCategoryTypes();
    initEvents();
    initEventTypes();
    initNewsFeed();
    initCompetitors();
    initSendPushNotifications();
    initVideos();
}

export function reset() {
    di.clear();
    init();
}

function initApp() {
    di.bindLazySingleton(appDIKeys.axiosInstanceAPI, () =>
        axios.create({
            baseURL: "/api/v1/",
        })
    );

    di.bindLazySingleton(appDIKeys.tokenStorage, () => new TokenLocalStorage());

    di.bindLazySingleton(
        appDIKeys.userRepository,
        () =>
            new UserApiRepository(
                di.get(appDIKeys.axiosInstanceAPI),
                di.get(appDIKeys.tokenStorage)
            )
    );
    di.bindLazySingleton(
        GetCurrentUserUseCase,
        () => new GetCurrentUserUseCase(di.get<UserRepository>(appDIKeys.userRepository))
    );
    di.bindLazySingleton(
        RemoveCurrentUserUseCase,
        () => new RemoveCurrentUserUseCase(di.get<UserRepository>(appDIKeys.userRepository))
    );

    di.bindFactory(
        AppBloc,
        () => new AppBloc(di.get(GetCurrentUserUseCase), di.get(RemoveCurrentUserUseCase))
    );
}

function initLogin() {
    di.bindLazySingleton(LoginUseCase, () => new LoginUseCase(di.get(appDIKeys.userRepository)));
    di.bindFactory(LoginBloc, () => new LoginBloc(di.get(LoginUseCase)));
}

function initSendPushNotifications() {
    di.bindLazySingleton(appDIKeys.axiosInstancePush, () =>
        axios.create({
            baseURL: "https://fcm.googleapis.com/fcm",
        })
    );

    const fcmApiToken = process.env.REACT_APP_FCM_API_TOKEN || "";

    di.bindLazySingleton(
        appDIKeys.pushNotificationRepository,
        () => new FcmPushNotificationRepository(di.get(appDIKeys.axiosInstancePush), fcmApiToken)
    );

    di.bindLazySingleton(
        SendPushNotificationUseCase,
        () => new SendPushNotificationUseCase(di.get(appDIKeys.pushNotificationRepository))
    );

    di.bindFactory(
        SendPushNotificationBloc,
        () => new SendPushNotificationBloc(di.get(SendPushNotificationUseCase))
    );
}
