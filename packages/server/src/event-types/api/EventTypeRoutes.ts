import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "../../CompositionRoot";
import { names } from "../../CompositionRoot";
import { JwtAuthenticator } from "../../server";
import { EventTypeController } from "./EventTypeController";

export const eventTypesEndpoint = "event-types";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get<JwtAuthenticator>(names.jwtAuthenticator);

    return [
        {
            method: "GET",
            path: `${apiPrefix}/${eventTypesEndpoint}`,
            options: { auth: jwtAuthenticator.name },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(EventTypeController).getAll(request, h);
            },
        },
        {
            method: "GET",
            path: `${apiPrefix}/${eventTypesEndpoint}/{id}`,
            options: { auth: jwtAuthenticator.name },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(EventTypeController).get(request, h);
            },
        },
        {
            method: "POST",
            path: `${apiPrefix}/${eventTypesEndpoint}`,
            options: { auth: jwtAuthenticator.name },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(EventTypeController).post(request, h);
            },
        },
        {
            method: "PUT",
            path: `${apiPrefix}/${eventTypesEndpoint}/{id}`,
            options: { auth: jwtAuthenticator.name },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(EventTypeController).put(request, h);
            },
        },
        {
            method: "DELETE",
            path: `${apiPrefix}/${eventTypesEndpoint}/{id}`,
            options: { auth: jwtAuthenticator.name },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(EventTypeController).delete(request, h);
            },
        },
    ];
}
