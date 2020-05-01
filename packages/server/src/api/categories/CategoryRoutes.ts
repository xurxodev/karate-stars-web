
import * as hapi from "@hapi/hapi";

import CategoryRepository from "../../data/categories/CategoryJsonRepository";
import GetCategoriesUseCase from "../../domain/categories/usecases/GetCategoriesUseCase";
import jwtAuthentication from "../users/JwtAuthentication";
import CategoryController from "./CategoryController";

export default function (apiPrefix: string): hapi.ServerRoute[] {
  const categoryRepository = new CategoryRepository();
  const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);
  const categoryController = new CategoryController(getCategoriesUseCase);

  return [
    {
      method: "GET",
      path: `${apiPrefix}/categories`,
      options: {
        auth: jwtAuthentication.name
      },
      handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
        return categoryController.get(request, h);
      }
    }
  ];
}
