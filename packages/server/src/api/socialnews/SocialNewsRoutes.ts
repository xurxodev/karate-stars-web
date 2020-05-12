import * as hapi from "@hapi/hapi";
import SocialNewsRepository from "../../data/socialnews/SocialNewsTwitterRepository";
import GetSocialNewsUseCase from "../../domain/socialnews/usecases/GetSocialNewsUseCase";
import SocialNewsController from "../socialnews/SocialNewsController";
import jwtAuthentication from "../users/JwtAuthentication";

export default function(apiPrefix: string): hapi.ServerRoute[] {
  const socialNewsRepository = new SocialNewsRepository();
  const getSocialNewsUseCase = new GetSocialNewsUseCase(socialNewsRepository);
  const socialNewsController = new SocialNewsController(getSocialNewsUseCase);

  return [
    {
      method: "GET",
      path: `${apiPrefix}/socialnews`,
      options: {
        auth: jwtAuthentication.name
      },
      handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
        return socialNewsController.get(request, h);
      }
    }
  ];
}
