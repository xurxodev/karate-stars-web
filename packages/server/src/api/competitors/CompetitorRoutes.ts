import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "./../../CompositionRoot";
import CompetitorsRepository from "../../data/competitors/CompetitorJsonRepository";
import GetCompetitorsUseCase from "../../domain/competitors/usecases/GetCompetitorsUseCase";
import CompetitorController from "./CompetitorController";
import { names } from "./../../CompositionRoot";
import { JwtAuthenticator } from "../../server";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get<JwtAuthenticator>(names.jwtAuthenticator);
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
