import * as dotenv from "dotenv";
import * as hapi from "hapi";

import UserRepository from "../../data/users/UserEnvRepository";
import GetUserByUsernameUseCase from "../../domain/users/usecases/GetUserByUsernameUseCase";
import UserController from "./UserController";

export default function(): hapi.ServerRoute[] {

  dotenv.config();

  const userRespository = new UserRepository();
  const getProductByIdUseCase = new GetUserByUsernameUseCase(userRespository);
  const userController = new UserController(getProductByIdUseCase);

  return [
    {
      method: "POST",
      path: "/v1/login",
      options: { auth: false },
      handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
        return userController.login(request, h);
      }
    }
  ];
}
