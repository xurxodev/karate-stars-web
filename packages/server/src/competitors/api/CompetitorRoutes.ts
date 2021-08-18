import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "../../CompositionRoot";
import { appDIKeys } from "../../CompositionRoot";
import { JwtAuthenticator } from "../../server";
import { CompetitorController } from "./CompetitorController";
import { competitorSchema } from "./competitorSchema";

export const CompetitorsEndpoint = "competitors";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get<JwtAuthenticator>(appDIKeys.jwtAuthenticator);

    return [
        {
            method: "GET",
            path: `${apiPrefix}/${CompetitorsEndpoint}`,
            options: { auth: jwtAuthenticator.name },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(CompetitorController).getAll(request, h);
            },
        },
        {
            method: "GET",
            path: `${apiPrefix}/${CompetitorsEndpoint}/{id}`,
            options: { auth: jwtAuthenticator.name },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(CompetitorController).get(request, h);
            },
        },
        {
            method: "POST",
            path: `${apiPrefix}/${CompetitorsEndpoint}`,
            options: { auth: jwtAuthenticator.name, validate: { payload: competitorSchema } },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(CompetitorController).post(request, h);
            },
        },
        {
            method: "PUT",
            path: `${apiPrefix}/${CompetitorsEndpoint}/{id}`,
            options: { auth: jwtAuthenticator.name, validate: { payload: competitorSchema } },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(CompetitorController).put(request, h);
            },
        },
        {
            method: "PUT",
            path: `${apiPrefix}/${CompetitorsEndpoint}/{id}/image`,
            options: {
                payload: {
                    maxBytes: 1024 * 1024 * 5,
                    multipart: {
                        output: "stream",
                    },
                    parse: true,
                },
                handler: async (request, h) => {
                    return CompositionRoot.di.get(CompetitorController).putImage(request, h);
                },
            },
        },
        {
            method: "DELETE",
            path: `${apiPrefix}/${CompetitorsEndpoint}/{id}`,
            options: { auth: jwtAuthenticator.name },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(CompetitorController).delete(request, h);
            },
        },
    ];
}
