import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "../../CompositionRoot";
import { appDIKeys } from "../../CompositionRoot";
import { JwtAuthenticator } from "../../server";
import { CategoryTypeController } from "./CategoryTypeController";
import { categoryTypeSchema } from "./categoryTypeSchema";

export const CategoryTypesEndpoint = "category-types";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get<JwtAuthenticator>(appDIKeys.jwtAuthenticator);

    return [
        {
            method: "GET",
            path: `${apiPrefix}/${CategoryTypesEndpoint}`,
            options: { auth: jwtAuthenticator.name },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(CategoryTypeController).getAll(request, h);
            },
        },
        {
            method: "GET",
            path: `${apiPrefix}/${CategoryTypesEndpoint}/{id}`,
            options: { auth: jwtAuthenticator.name },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(CategoryTypeController).get(request, h);
            },
        },
        {
            method: "POST",
            path: `${apiPrefix}/${CategoryTypesEndpoint}`,
            options: { auth: jwtAuthenticator.name, validate: { payload: categoryTypeSchema } },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(CategoryTypeController).post(request, h);
            },
        },
        {
            method: "PUT",
            path: `${apiPrefix}/${CategoryTypesEndpoint}/{id}`,
            options: { auth: jwtAuthenticator.name, validate: { payload: categoryTypeSchema } },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(CategoryTypeController).put(request, h);
            },
        },
        {
            method: "DELETE",
            path: `${apiPrefix}/${CategoryTypesEndpoint}/{id}`,
            options: { auth: jwtAuthenticator.name },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(CategoryTypeController).delete(request, h);
            },
        },
    ];
}
