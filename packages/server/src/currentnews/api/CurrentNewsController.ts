import * as hapi from "@hapi/hapi";
import GetCurrentNewsUseCase from "../domain/usecases/GetCurrentNewsUseCase";

export default class CurrentNewsController {
    private getCurrentNewsUseCase: GetCurrentNewsUseCase;

    constructor(getCurrentNewsUseCase: GetCurrentNewsUseCase) {
        this.getCurrentNewsUseCase = getCurrentNewsUseCase;
    }

    public get(_request: hapi.Request, _h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        return this.getCurrentNewsUseCase.execute();
    }
}
