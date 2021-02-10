import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "./../../CompositionRoot";
import CountryRepository from "../../countries/data/CountryJsonRepository";
import CountryController from "./CountryController";
import { names } from "./../../CompositionRoot";
import { JwtAuthenticator } from "../../server";
import GetCountriesUseCase from "../domain/usecases/GetCountriesUseCase";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get<JwtAuthenticator>(names.jwtAuthenticator);
    const countryRepository = new CountryRepository();
    const getCountriesUseCase = new GetCountriesUseCase(countryRepository);
    const countryController = new CountryController(getCountriesUseCase);

    return [
        {
            method: "GET",
            path: `${apiPrefix}/countries`,
            options: {
                auth: jwtAuthenticator.name,
            },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return countryController.get(request, h);
            },
        },
    ];
}
