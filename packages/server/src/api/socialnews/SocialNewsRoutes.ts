import * as hapi from "@hapi/hapi";
import SocialNewsController from "../socialnews/SocialNewsController";
import jwtAuthentication from "../authentication/JwtAuthentication";
import CompositionRoot from "../../CompositionRoot";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const socialNewsController = CompositionRoot.getInstance().get(SocialNewsController);

    return [
        {
            method: "GET",
            path: `${apiPrefix}/socialnews`,
            options: {
                auth: jwtAuthentication.name,
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
