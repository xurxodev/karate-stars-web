import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "../../CompositionRoot";
import { names } from "../../CompositionRoot";
import { JwtAuthenticator } from "../../server";
import NewsFeedsController from "./NewsFeedsController";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get<JwtAuthenticator>(names.jwtAuthenticator);

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
                return CompositionRoot.di.get(NewsFeedsController).getAll(request, h);
            },
        },
        {
            method: "GET",
            path: `${apiPrefix}/news-feeds/{id}`,
            options: {
                auth: jwtAuthenticator.name,
            },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(NewsFeedsController).get(request, h);
            },
        },
    ];
}
