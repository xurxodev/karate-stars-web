import * as hapi from "hapi";

import CurrentNewsRepository from "../../data/currentnews/CurrentNewsNetworkRepository";
import GetCurrentNewsUseCase from "../../domain/currentnews/usecases/GetCurrentNewsUseCase";
import jwtAuthentication from "../users/JwtAuthentication";
import CurrentNewsController from "./CurrentNewsController";

export default function(): hapi.ServerRoute[] {
  const currentNewsRepository = new CurrentNewsRepository();
  const getCurrentNewsUseCase = new GetCurrentNewsUseCase(currentNewsRepository);
  const currentNewsController = new CurrentNewsController(getCurrentNewsUseCase);

  return [
    {
      method: "GET",
      path: "/v1/currentnews",
      options: {
        auth: jwtAuthentication.name
      },
      handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
        return currentNewsController.get(request, h);
      }
    }
  ];
}
