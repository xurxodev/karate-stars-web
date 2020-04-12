
import * as hapi from "hapi";

import CountryRepository from "../../data/countries/CountryJsonRepository";
import GetCountriesUseCase from "../../domain/countries/usecases/GetCountriesUseCase";
import jwtAuthentication from "../users/JwtAuthentication";
import CountryController from "./CountryController";

export default function (): hapi.ServerRoute[] {
  const countryRepository = new CountryRepository();
  const getCountriesUseCase = new GetCountriesUseCase(countryRepository);
  const countryController = new CountryController(getCountriesUseCase);

  return [
    {
      method: "GET",
      path: "/v1/countries",
      options: {
        auth: jwtAuthentication.name
      },
      handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
        return countryController.get(request, h);
      }
    }
  ];
}
