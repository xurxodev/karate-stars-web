import { GetCategoryTypesUseCase } from "../domain/usecases/GetCategoryTypesUseCase";
import { JwtAuthenticator } from "../../server";
import { CategoryTypeData } from "karate-stars-core";
import { runDelete, runGet, runGetAll, runPost, runPut } from "../../common/api/AdminController";
import { GetCategoryTypeByIdUseCase } from "../domain/usecases/GetCategoryTypeByIdUseCase";
import { CreateCategoryTypeUseCase } from "../domain/usecases/CreateCategoryTypeUseCase";
import { UpdateCategoryTypeUseCase } from "../domain/usecases/UpdateCategoryTypeUseCase";
import { DeleteCategoryTypeUseCase } from "../domain/usecases/DeleteCategoryTypeUseCase";
import * as hapi from "@hapi/hapi";

export class CategoryTypeController {
    constructor(
        private jwtAuthenticator: JwtAuthenticator,
        private getCategoryTypesUseCase: GetCategoryTypesUseCase,
        private getCategoryTypeByIdUseCase: GetCategoryTypeByIdUseCase,
        private createCategoryTypeUseCase: CreateCategoryTypeUseCase,
        private updateCategoryTypeUseCase: UpdateCategoryTypeUseCase,
        private deleteCategoryTypeUseCase: DeleteCategoryTypeUseCase
    ) {}

    async getAll(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runGetAll(request, h, this.jwtAuthenticator, userId =>
            this.getCategoryTypesUseCase.execute({ userId })
        );
    }

    async get(request: hapi.Request, h: hapi.ResponseToolkit): Promise<hapi.Lifecycle.ReturnValue> {
        return runGet(request, h, this.jwtAuthenticator, (userId: string, id: string) =>
            this.getCategoryTypeByIdUseCase.execute({ userId, id })
        );
    }

    async post(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runPost(
            request,
            h,
            this.jwtAuthenticator,
            (userId: string, data: CategoryTypeData) =>
                this.createCategoryTypeUseCase.execute({ userId, data })
        );
    }

    async put(request: hapi.Request, h: hapi.ResponseToolkit): Promise<hapi.Lifecycle.ReturnValue> {
        return runPut(
            request,
            h,
            this.jwtAuthenticator,
            (userId: string, id: string, data: CategoryTypeData) =>
                this.updateCategoryTypeUseCase.execute({ userId, id, data })
        );
    }

    async delete(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runDelete(request, h, this.jwtAuthenticator, (userId: string, id: string) =>
            this.deleteCategoryTypeUseCase.execute({ userId, id })
        );
    }
}
