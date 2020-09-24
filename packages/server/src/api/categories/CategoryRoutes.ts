import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "./../../CompositionRoot";
import JwtAuthenticator from "../authentication/JwtAuthenticator";
import CategoryRepository from "../../data/categories/CategoryJsonRepository";
import GetCategoriesUseCase from "../../domain/categories/usecases/GetCategoriesUseCase";
import CategoryController from "./CategoryController";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get(JwtAuthenticator);
    const categoryRepository = new CategoryRepository();
    const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);
    const categoryController = new CategoryController(getCategoriesUseCase);

    return [
        {
            method: "GET",
            path: `${apiPrefix}/categories`,
            options: {
                auth: jwtAuthenticator.name,
            },
            handler: (
                request: hapi.Request,
                h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return categoryController.get(request, h);
            },
        },
    ];
}
