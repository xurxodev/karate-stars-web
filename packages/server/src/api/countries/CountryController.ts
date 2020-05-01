
import * as boom from "@hapi/boom";
import * as hapi from "@hapi/hapi";
import GetCountriesUseCase from "../../domain/countries/usecases/GetCountriesUseCase";

export default class CountryController {

    private getCountriesUseCase: GetCountriesUseCase;

    constructor(getCountriesUseCase: GetCountriesUseCase) {
        this.getCountriesUseCase = getCountriesUseCase;
    }

    public get(request: hapi.Request, h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        return this.getCountriesUseCase.execute();
    }
}
