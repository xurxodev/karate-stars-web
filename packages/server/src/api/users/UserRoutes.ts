import * as hapi from "@hapi/hapi";
import * as dotenv from "dotenv";

import UserRepository from "../../data/users/UserEnvRepository";
import GetUserByIdUseCase from "../../domain/users/usecases/GetUserByIdUseCase";
import GetUserByUsernameUseCase from "../../domain/users/usecases/GetUserByUsernameUseCase";
import jwtAuthentication from "./JwtAuthentication";
import UserController from "./UserController";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    dotenv.config();

    const userRespository = new UserRepository();
    const getUserByUsernameUseCase = new GetUserByUsernameUseCase(userRespository);
    const getUserByIdUseCase = new GetUserByIdUseCase(userRespository);
    const userController = new UserController(getUserByUsernameUseCase, getUserByIdUseCase);

    return [
        {
            method: "POST",
            path: `${apiPrefix}/login`,
            options: { auth: false },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return userController.login(request, h);
            },
        },
        {
            method: "GET",
            path: `${apiPrefix}/me`,
            options: {
                auth: jwtAuthentication.name,
            },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return userController.getCurrentUser(request, h);
            },
        },
    ];
}
