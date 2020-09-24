import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "../../CompositionRoot";
import JwtAuthenticator from "../authentication/JwtAuthenticator";
import NewsFeedsController from "./NewsFeedsController";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get(JwtAuthenticator);
    const newsFeedsController = CompositionRoot.di.get(NewsFeedsController);

    return [
        {
            method: "GET",
            path: `${apiPrefix}/news-feeds`,
            options: {
                auth: jwtAuthenticator.name,
            },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return newsFeedsController.getAll(request, h);
            },
        },
    ];
}
