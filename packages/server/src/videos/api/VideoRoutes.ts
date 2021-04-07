import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "./../../CompositionRoot";
import VideoRepository from "../../videos/data/VideosJsonRepository";
import VideoController from "./VideoController";
import { appDIKeys } from "./../../CompositionRoot";
import { JwtAuthenticator } from "../../server";
import GetVideosUseCase from "../domain/usecases/GetVideosUseCase";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get<JwtAuthenticator>(appDIKeys.jwtAuthenticator);
    const videoRepository = new VideoRepository();
    const getVideosUseCase = new GetVideosUseCase(videoRepository);
    const videoController = new VideoController(getVideosUseCase);

    return [
        {
            method: "GET",
            path: `${apiPrefix}/videos`,
            options: {
                auth: jwtAuthenticator.name,
            },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return videoController.get(request, h);
            },
        },
    ];
}
