import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "../../CompositionRoot";
import { names } from "../../CompositionRoot";
import { JwtAuthenticator } from "../../server";
import UserController from "./UserController";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get<JwtAuthenticator>(names.jwtAuthenticator);

    return [
        {
            method: "POST",
            path: `${apiPrefix}/login`,
            options: { auth: false },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(UserController).login(request, h);
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
                return CompositionRoot.di.get(UserController).getCurrentUser(request, h);
            },
        },
    ];
}
