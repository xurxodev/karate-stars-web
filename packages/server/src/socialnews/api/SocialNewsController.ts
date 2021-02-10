import * as hapi from "@hapi/hapi";
import GetSocialNewsUseCase from "../domain/usecases/GetSocialNewsUseCase";

export default class SocialNewsController {
    private getSocialNewsUseCase: GetSocialNewsUseCase;

    constructor(getSocialNewsUseCase: GetSocialNewsUseCase) {
        this.getSocialNewsUseCase = getSocialNewsUseCase;
    }

    public get(_request: hapi.Request, _h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        return this.getSocialNewsUseCase.execute();
    }
}
