
import * as hapi from "hapi";

import VideoRepository from "../../data/videos/VideosJsonRepository";
import jwtAuthentication from "../users/JwtAuthentication";
import GetVideosUseCase from "../../domain/videos/usecases/GetVideosUseCase";
import VideoController from "./VideoController";

export default function (): hapi.ServerRoute[] {
  const videoRepository = new VideoRepository();
  const getVideosUseCase = new GetVideosUseCase(videoRepository);
  const videoController = new VideoController(getVideosUseCase);

  return [
    {
      method: "GET",
      path: "/v1/videos",
      options: {
        auth: jwtAuthentication.name
      },
      handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
        return videoController.get(request, h);
      }
    }
  ];
}
