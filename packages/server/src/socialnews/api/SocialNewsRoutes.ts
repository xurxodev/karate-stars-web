import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "../../CompositionRoot";
import { appDIKeys } from "../../CompositionRoot";
import { JwtAuthenticator } from "../../server";
import SocialNewsController from "./SocialNewsController";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get<JwtAuthenticator>(appDIKeys.jwtAuthenticator);

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
                return CompositionRoot.di.get(SocialNewsController).get(request, h);
            },
        },
    ];
}
