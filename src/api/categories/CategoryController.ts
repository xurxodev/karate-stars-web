
import * as boom from "@hapi/boom";
import * as hapi from "hapi";
import GetCategoriesUseCase from "../../domain/categories/usecases/GetCategoriesUseCase";

export default class CountryController {

    private getCategoriesUseCase: GetCategoriesUseCase;

    constructor(getCategoriesUseCase: GetCategoriesUseCase) {
        this.getCategoriesUseCase = getCategoriesUseCase;
    }

    public get(request: hapi.Request, h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        return this.getCategoriesUseCase.execute();
    }
}
