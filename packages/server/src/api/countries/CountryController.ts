import * as hapi from "@hapi/hapi";
import GetCountriesUseCase from "../../domain/countries/usecases/GetCountriesUseCase";

export default class CountryController {
    private getCountriesUseCase: GetCountriesUseCase;

    constructor(getCountriesUseCase: GetCountriesUseCase) {
        this.getCountriesUseCase = getCountriesUseCase;
    }

    public get(_request: hapi.Request, _h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        return this.getCountriesUseCase.execute();
    }
}
