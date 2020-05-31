import * as hapi from "@hapi/hapi";
import GetCategoriesUseCase from "../../domain/categories/usecases/GetCategoriesUseCase";

export default class CountryController {
    private getCategoriesUseCase: GetCategoriesUseCase;

    constructor(getCategoriesUseCase: GetCategoriesUseCase) {
        this.getCategoriesUseCase = getCategoriesUseCase;
    }

    public get(_request: hapi.Request, _h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        return this.getCategoriesUseCase.execute();
    }
}
