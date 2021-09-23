import { GetCategoriesUseCase } from "../domain/usecases/GetCategoriesUseCase";
import { JwtAuthenticator } from "../../server";
import { CategoryData } from "karate-stars-core";
import { runDelete, runGet, runGetAll, runPost, runPut } from "../../common/api/AdminController";
import { GetCategoryByIdUseCase } from "../domain/usecases/GetCategoryByIdUseCase";
import { CreateCategoryUseCase } from "../domain/usecases/CreateCategoryUseCase";
import { UpdateCategoryUseCase } from "../domain/usecases/UpdateCategoryUseCase";
import { DeleteCategoryUseCase } from "../domain/usecases/DeleteCategoryUseCase";
import * as hapi from "@hapi/hapi";

export class CategoryController {
    constructor(
        private jwtAuthenticator: JwtAuthenticator,
        private getCategoriesUseCase: GetCategoriesUseCase,
        private getCategoryByIdUseCase: GetCategoryByIdUseCase,
        private createCategoryUseCase: CreateCategoryUseCase,
        private updateCategoryUseCase: UpdateCategoryUseCase,
        private deleteCategoryUseCase: DeleteCategoryUseCase
    ) {}

    async getAll(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runGetAll(request, h, this.jwtAuthenticator, _userId =>
            this.getCategoriesUseCase.execute()
        );
    }

    async get(request: hapi.Request, h: hapi.ResponseToolkit): Promise<hapi.Lifecycle.ReturnValue> {
        return runGet(request, h, this.jwtAuthenticator, (_userId: string, id: string) =>
            this.getCategoryByIdUseCase.execute({ id })
        );
    }

    async post(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runPost(request, h, this.jwtAuthenticator, (userId: string, data: CategoryData) =>
            this.createCategoryUseCase.execute({ userId, data })
        );
    }

    async put(request: hapi.Request, h: hapi.ResponseToolkit): Promise<hapi.Lifecycle.ReturnValue> {
        return runPut(
            request,
            h,
            this.jwtAuthenticator,
            (userId: string, id: string, data: CategoryData) =>
                this.updateCategoryUseCase.execute({ userId, id, data })
        );
    }

    async delete(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runDelete(request, h, this.jwtAuthenticator, (userId: string, id: string) =>
            this.deleteCategoryUseCase.execute({ userId, id })
        );
    }
}
