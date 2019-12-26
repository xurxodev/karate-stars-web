
import * as boom from "@hapi/boom";
import * as hapi from "hapi";
import GetCurrentNewsUseCase from "../../domain/currentnews/usecases/GetCurrentNewsUseCase";

export default class CurrentNewsController {

    private getCurrentNewsUseCase: GetCurrentNewsUseCase;

    constructor(getCurrentNewsUseCase: GetCurrentNewsUseCase) {
        this.getCurrentNewsUseCase = getCurrentNewsUseCase;
    }

    public get(request: hapi.Request, h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        return this.getCurrentNewsUseCase.execute();
    }
}
