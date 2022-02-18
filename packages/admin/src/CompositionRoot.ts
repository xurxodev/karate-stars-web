import LoginBloc from "./user/presentation/LoginBloc";
import LoginUseCase from "./user/domain/LoginUseCase";
import UserApiRepository from "./user/data/UserApiRepository";
import axios from "axios";
import { TokenLocalStorage } from "./common/data/TokenLocalStorage";
import GetCurrentUserUseCase from "./user/domain/GetCurrentUserUseCase";
import AppBloc from "./app/AppBloc";
import RemoveCurrentUserUseCase from "./user/domain/RemoveCurrentUserUseCase";
import SendUrlNotificationBloc from "./notifications/presentation/SendUrlNotificationBloc";
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
import { initCategories } from "./categories/CategoryDIModule";
import { initCountries } from "./countries/CountryDIModule";
import SendCompetitorNotificationBloc from "./notifications/presentation/SendCompetitorNotificationBloc";
import SendVideoNotificationBloc from "./notifications/presentation/SendVideoNotificationBloc";
import GetCompetitorsUseCase from "./competitors/domain/GetCompetitorsUseCase";
import GetVideosUseCase from "./videos/domain/GetVideosUseCase";

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
    initCategories();
    initCategoryTypes();
    initCountries();
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
    di.bindLazySingleton(appDIKeys.axiosInstanceAPI, () => {
        const axiosInstance = axios.create({
            baseURL: "/api/v1/",
        });

        const isoDateFormat =
            /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

        const isIsoDateString = (value: any) => {
            return value && typeof value === "string" && isoDateFormat.test(value);
        };

        const handleDates = (body: any) => {
            if (body === null || body === undefined || typeof body !== "object") return body;

            for (const key of Object.keys(body)) {
                const value = body[key];
                if (isIsoDateString(value)) {
                    body[key] = new Date(value);
                } else if (typeof value === "object") {
                    handleDates(value);
                }
            }
        };

        axiosInstance.interceptors.response.use(originalResponse => {
            handleDates(originalResponse.data);
            return originalResponse;
        });

        return axiosInstance;
    });

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
        SendUrlNotificationBloc,
        () => new SendUrlNotificationBloc(di.get(SendPushNotificationUseCase))
    );

    di.bindFactory(
        SendCompetitorNotificationBloc,
        () =>
            new SendCompetitorNotificationBloc(
                di.get(SendPushNotificationUseCase),
                di.get(GetCompetitorsUseCase)
            )
    );

    di.bindFactory(
        SendVideoNotificationBloc,
        () =>
            new SendVideoNotificationBloc(
                di.get(SendPushNotificationUseCase),
                di.get(GetVideosUseCase)
            )
    );
}
