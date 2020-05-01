
import * as boom from "@hapi/boom";
import * as hapi from "@hapi/hapi";
import GetSocialNewsUseCase from "../../domain/socialnews/usecases/GetSocialNewsUseCase";

export default class SocialNewsController {

    private getSocialNewsUseCase: GetSocialNewsUseCase;

    constructor(
        getSocialNewsUseCase: GetSocialNewsUseCase) {
        this.getSocialNewsUseCase = getSocialNewsUseCase;
    }

    public get(request: hapi.Request, h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        return this.getSocialNewsUseCase.execute();
    }
}
