import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "../../CompositionRoot";
import JwtAuthenticator from "../authentication/JwtAuthenticator";
import SocialNewsController from "../socialnews/SocialNewsController";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get(JwtAuthenticator);
    const socialNewsController = CompositionRoot.di.get(SocialNewsController);

    return [
        {
            method: "GET",
            path: `${apiPrefix}/socialnews`,
            options: {
                auth: jwtAuthenticator.name,
            },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return socialNewsController.get(request, h);
            },
        },
    ];
}
