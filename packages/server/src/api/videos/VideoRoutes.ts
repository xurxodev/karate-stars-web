import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "./../../CompositionRoot";
import JwtAuthenticator from "../authentication/JwtAuthenticator";
import VideoRepository from "../../data/videos/VideosJsonRepository";
import GetVideosUseCase from "../../domain/videos/usecases/GetVideosUseCase";
import VideoController from "./VideoController";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get(JwtAuthenticator);
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
