import * as hapi from "@hapi/hapi";

import jwtAuthentication from "../authentication/JwtAuthentication";
import CurrentNewsController from "./CurrentNewsController";
import CompositionRoot from "../../CompositionRoot";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const currentNewsController = CompositionRoot.getInstance().get(CurrentNewsController);

    return [
        {
            method: "GET",
            path: `${apiPrefix}/currentnews`,
            options: {
                auth: jwtAuthentication.name,
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
