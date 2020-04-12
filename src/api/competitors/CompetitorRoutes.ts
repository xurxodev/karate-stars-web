import * as hapi from "hapi";

import CompetitorsRepository from "../../data/competitors/CompetitorJsonRepository";
import GetCompetitorsUseCase from "../../domain/competitors/usecases/GetCompetitorsUseCase";
import jwtAuthentication from "../users/JwtAuthentication";
import CompetitorController from "./CompetitorController";

export default function (): hapi.ServerRoute[] {
  const competitorsRepository = new CompetitorsRepository();
  const getCompetitorsUseCase = new GetCompetitorsUseCase(competitorsRepository);
  const competitorController = new CompetitorController(getCompetitorsUseCase);

  return [
    {
      method: "GET",
      path: "/v1/competitors",
      options: {
        auth: jwtAuthentication.name
      },
      handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
        return competitorController.get(request, h);
      }
    }
  ];
}
