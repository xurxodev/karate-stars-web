import LoginBloc from "./user/presentation/LoginBloc";
import LoginUseCase from "./user/domain/LoginUseCase";
import UserApiRepository from "./user/data/UserApiRepository";
import axios from "axios";

export default class CompositionRoot {
    private static instance: CompositionRoot;

    private constructor() { }

    static getInstance(): CompositionRoot {
        if (!CompositionRoot.instance) {
            CompositionRoot.instance = new CompositionRoot();
        }

        return CompositionRoot.instance;
    }

    provideLogicBloc(): LoginBloc {
        const axiosInstance = axios.create({
            baseURL: "/api/v1/",
        });
        const loginRepository = new UserApiRepository(axiosInstance);
        const loginUseCase = new LoginUseCase(loginRepository);
        const loginBloc = new LoginBloc(loginUseCase);

        return loginBloc
    }
}