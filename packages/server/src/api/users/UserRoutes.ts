import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "../../CompositionRoot";
import JwtAuthenticator from "../authentication/JwtAuthenticator";
import UserController from "./UserController";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get(JwtAuthenticator);
    const userController = CompositionRoot.di.get(UserController);

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
                auth: jwtAuthenticator.name,
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
