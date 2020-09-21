import * as hapi from "@hapi/hapi";

import jwtAuthentication from "../authentication/JwtAuthentication";
import CompositionRoot from "../../CompositionRoot";
import NewsFeedsController from "./NewsFeedsController";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const newsFeedsController = CompositionRoot.getInstance().get(NewsFeedsController);

    return [
        {
            method: "GET",
            path: `${apiPrefix}/news-feeds`,
            options: {
                auth: jwtAuthentication.name,
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
