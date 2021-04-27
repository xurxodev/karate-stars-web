import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "../../CompositionRoot";
import { appDIKeys } from "../../CompositionRoot";
import { JwtAuthenticator } from "../../server";
import { CountryController } from "./CountryController";
import { countrySchema } from "./countrySchema";

export const CountriesEndpoint = "countries";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get<JwtAuthenticator>(appDIKeys.jwtAuthenticator);

    return [
        {
            method: "GET",
            path: `${apiPrefix}/${CountriesEndpoint}`,
            options: { auth: jwtAuthenticator.name },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(CountryController).getAll(request, h);
            },
        },
        {
            method: "GET",
            path: `${apiPrefix}/${CountriesEndpoint}/{id}`,
            options: { auth: jwtAuthenticator.name },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(CountryController).get(request, h);
            },
        },
        {
            method: "POST",
            path: `${apiPrefix}/${CountriesEndpoint}`,
            options: { auth: jwtAuthenticator.name, validate: { payload: countrySchema } },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(CountryController).post(request, h);
            },
        },
        {
            method: "PUT",
            path: `${apiPrefix}/${CountriesEndpoint}/{id}`,
            options: { auth: jwtAuthenticator.name, validate: { payload: countrySchema } },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(CountryController).put(request, h);
            },
        },
        {
            method: "DELETE",
            path: `${apiPrefix}/${CountriesEndpoint}/{id}`,
            options: { auth: jwtAuthenticator.name },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return CompositionRoot.di.get(CountryController).delete(request, h);
            },
        },
    ];
}
