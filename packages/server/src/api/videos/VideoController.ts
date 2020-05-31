import * as hapi from "@hapi/hapi";
import GetVideosUseCase from "../../domain/videos/usecases/GetVideosUseCase";

export default class VideoController {
    private getVideosUseCase: GetVideosUseCase;

    constructor(getVideosUseCase: GetVideosUseCase) {
        this.getVideosUseCase = getVideosUseCase;
    }

    public get(_request: hapi.Request, _h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        return this.getVideosUseCase.execute();
    }
}
