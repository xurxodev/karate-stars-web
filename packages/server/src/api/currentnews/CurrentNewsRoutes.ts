import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "./../../CompositionRoot";
import CurrentNewsController from "./CurrentNewsController";
import JwtAuthenticator from "../authentication/JwtAuthenticator";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get(JwtAuthenticator);
    const currentNewsController = CompositionRoot.di.get(CurrentNewsController);

    return [
        {
            method: "GET",
            path: `${apiPrefix}/currentnews`,
            options: {
                auth: jwtAuthenticator.name,
            },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return currentNewsController.get(request, h);
            },
        },
    ];
}
