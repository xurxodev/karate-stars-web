import * as hapi from "@hapi/hapi";

import VideoRepository from "../../data/videos/VideosJsonRepository";
import GetVideosUseCase from "../../domain/videos/usecases/GetVideosUseCase";
import jwtAuthentication from "../users/JwtAuthentication";
import VideoController from "./VideoController";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const videoRepository = new VideoRepository();
    const getVideosUseCase = new GetVideosUseCase(videoRepository);
    const videoController = new VideoController(getVideosUseCase);

    return [
        {
            method: "GET",
            path: `${apiPrefix}/videos`,
            options: {
                auth: jwtAuthentication.name,
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
