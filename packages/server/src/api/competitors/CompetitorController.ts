import * as hapi from "@hapi/hapi";
import GetCompetitorsUseCase from "../../domain/competitors/usecases/GetCompetitorsUseCase";

export default class CompetitorController {
    private getCompetitorsUseCase: GetCompetitorsUseCase;

    constructor(getCompetitorsUseCase: GetCompetitorsUseCase) {
        this.getCompetitorsUseCase = getCompetitorsUseCase;
    }

    public get(_request: hapi.Request, _h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        return this.getCompetitorsUseCase.execute();
    }
}
