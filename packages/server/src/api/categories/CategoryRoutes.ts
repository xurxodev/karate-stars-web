import * as hapi from "@hapi/hapi";

import * as CompositionRoot from "./../../CompositionRoot";
import CategoryRepository from "../../data/categories/CategoryJsonRepository";
import GetCategoriesUseCase from "../../domain/categories/usecases/GetCategoriesUseCase";
import CategoryController from "./CategoryController";
import { names } from "./../../CompositionRoot";
import { JwtAuthenticator } from "../../server";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    const jwtAuthenticator = CompositionRoot.di.get<JwtAuthenticator>(names.jwtAuthenticator);
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
