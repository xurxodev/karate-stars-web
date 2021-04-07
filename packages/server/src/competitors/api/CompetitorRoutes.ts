import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "./../../CompositionRoot";
import CompetitorsRepository from "../../competitors/data/CompetitorJsonRepository";
import CompetitorController from "./CompetitorController";
import { appDIKeys } from "./../../CompositionRoot";
import { JwtAuthenticator } from "../../server";
import GetCompetitorsUseCase from "../domain/usecases/GetCompetitorsUseCase";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get<JwtAuthenticator>(appDIKeys.jwtAuthenticator);
    const competitorsRepository = new CompetitorsRepository();
    const getCompetitorsUseCase = new GetCompetitorsUseCase(competitorsRepository);
    const competitorController = new CompetitorController(getCompetitorsUseCase);

    return [
        {
            method: "GET",
            path: `${apiPrefix}/competitors`,
            options: {
                auth: jwtAuthenticator.name,
            },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return competitorController.get(request, h);
            },
        },
    ];
}
