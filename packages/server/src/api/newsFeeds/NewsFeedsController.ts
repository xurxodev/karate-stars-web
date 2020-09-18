import * as hapi from "@hapi/hapi";
import GetNewsFeedsUseCase from "../../domain/newsFeeds/usecases/GetNewsFeedsUseCase";

export default class NewsFeedsController {
    private getNewsFeedsUseCase: GetNewsFeedsUseCase;

    constructor(getNewsFeedsUseCase: GetNewsFeedsUseCase) {
        this.getNewsFeedsUseCase = getNewsFeedsUseCase;
    }

    public getAll(_request: hapi.Request, _h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        return this.getNewsFeedsUseCase.execute();
    }
}
