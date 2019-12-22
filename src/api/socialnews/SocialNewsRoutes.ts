import * as hapi from "hapi";
import BannerRepository from "../../data/socialnews/SocialNewsInMemoryRepository";
import GetBannersUseCase from "../../domain/socialnews/usecases/GetSocialNewsUseCase";
import jwtAuthentication from "../users/JwtAuthentication";
import SocialNewsController from "./SocialNewsController";

export default function(): hapi.ServerRoute[] {
  const bannerRepository = new BannerRepository();
  const getBannersUseCase = new GetBannersUseCase(bannerRepository);
  const socialNewsController = new SocialNewsController(getBannersUseCase);

  return [
    {
      method: "GET",
      path: "/v1/socialnews",
      options: {
        auth: jwtAuthentication.name
      },
      handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
        return socialNewsController.get(request, h);
      }
    }
  ];
}
