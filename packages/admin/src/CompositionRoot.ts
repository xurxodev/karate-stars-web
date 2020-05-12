import LoginBloc from "./user/presentation/LoginBloc";
import LoginUseCase from "./user/domain/LoginUseCase";
import UserApiRepository from "./user/data/UserApiRepository";
import axios from "axios";
import { TokenLocalStorage } from "./common/data/TokenLocalStorage";
import GetCurrentUserUseCase from "./user/domain/GetCurrentUserUseCase";
import AppBloc from "./app/AppBloc";
import RemoveCurrentUserUseCase from "./user/domain/RemoveCurrentUserUseCase";

export default class CompositionRoot {
    private static instance: CompositionRoot;

    private constructor() { }

    static getInstance(): CompositionRoot {
        if (!CompositionRoot.instance) {
            CompositionRoot.instance = new CompositionRoot();
        }

        return CompositionRoot.instance;
    }

    //TODO: create DIContainer dictionary y hacer bind de cada depeendencia

    provideAppBloc(): AppBloc {
        const axiosInstance = axios.create({
            baseURL: "/api/v1/",
        });
        const tokenStorage = new TokenLocalStorage();
        const userApiRepository = new UserApiRepository(axiosInstance, tokenStorage);
        const getCurrentUserUseCase = new GetCurrentUserUseCase(userApiRepository);
        const removeCurrentUserUseCase = new RemoveCurrentUserUseCase(userApiRepository);
        const appBloc = new AppBloc(getCurrentUserUseCase, removeCurrentUserUseCase);

        return appBloc
    }

    provideLogicBloc(): LoginBloc {
        const axiosInstance = axios.create({
            baseURL: "/api/v1/",
        });
        const tokenStorage = new TokenLocalStorage();
        const loginRepository = new UserApiRepository(axiosInstance, tokenStorage);
        const loginUseCase = new LoginUseCase(loginRepository);
        const loginBloc = new LoginBloc(loginUseCase);

        return loginBloc
    }
}