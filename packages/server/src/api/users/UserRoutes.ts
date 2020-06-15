import * as hapi from "@hapi/hapi";

import jwtAuthentication from "./JwtAuthentication";
import UserController from "./UserController";
import CompositionRoot from "../../CompositionRoot";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const userController = CompositionRoot.getInstance().get(UserController);

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
