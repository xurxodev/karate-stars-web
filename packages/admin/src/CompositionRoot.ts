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
import DIContainer from "./DIContainer";

export const names = {
    AxiosInstanceAPI: "axiosInstanceAPI",
    AxiosInstancePush: "axiosInstancePush",
    UserRepository: "userRepository",
    PushNotificationRepository: "pushNotificationRepository",
    TokenStorage: "tokenStorage",
};

export const di = DIContainer.getInstance();

export function init() {
    initApp();
    initLogin();
    initSendPushNotifications();
}

export function reset() {
    di.clear();
    init();
}

function initApp() {
    di.bindLazySingleton(names.AxiosInstanceAPI, () =>
        axios.create({
            baseURL: "/api/v1/",
        })
    );

    di.bindLazySingleton(names.TokenStorage, () => new TokenLocalStorage());

    di.bindLazySingleton(
        names.UserRepository,
        () => new UserApiRepository(di.get(names.AxiosInstanceAPI), di.get(names.TokenStorage))
    );
    di.bindLazySingleton(
        GetCurrentUserUseCase,
        () => new GetCurrentUserUseCase(di.get(names.UserRepository))
    );
    di.bindLazySingleton(
        RemoveCurrentUserUseCase,
        () => new RemoveCurrentUserUseCase(di.get(names.UserRepository))
    );

    di.bindFactory(
        AppBloc,
        () => new AppBloc(di.get(GetCurrentUserUseCase), di.get(RemoveCurrentUserUseCase))
    );
}

function initLogin() {
    di.bindLazySingleton(LoginUseCase, () => new LoginUseCase(di.get(names.UserRepository)));
    di.bindFactory(LoginBloc, () => new LoginBloc(di.get(LoginUseCase)));
}

function initSendPushNotifications() {
    di.bindLazySingleton(names.AxiosInstancePush, () =>
        axios.create({
            baseURL: "https://fcm.googleapis.com/fcm",
        })
    );

    const fcmApiToken = process.env.REACT_APP_FCM_API_TOKEN || "";

    di.bindLazySingleton(
        names.PushNotificationRepository,
        () => new FcmPushNotificationRepository(di.get(names.AxiosInstancePush), fcmApiToken)
    );

    di.bindLazySingleton(
        SendPushNotificationUseCase,
        () => new SendPushNotificationUseCase(di.get(names.PushNotificationRepository))
    );

    di.bindFactory(
        SendPushNotificationBloc,
        () => new SendPushNotificationBloc(di.get(SendPushNotificationUseCase))
    );
}
