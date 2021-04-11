import { GetCompetitorsUseCase } from "../domain/usecases/GetCompetitorsUseCase";
import { JwtAuthenticator } from "../../server";
import { CompetitorData } from "karate-stars-core";
import { runDelete, runGet, runGetAll, runPost, runPut } from "../../common/api/AdminController";
import { GetCompetitorByIdUseCase } from "../domain/usecases/GetCompetitorByIdUseCase";
import { CreateCompetitorUseCase } from "../domain/usecases/CreateCompetitorUseCase";
import { UpdateCompetitorUseCase } from "../domain/usecases/UpdateCompetitorUseCase";
import { DeleteCompetitorUseCase } from "../domain/usecases/DeleteCompetitorUseCase";
import * as hapi from "@hapi/hapi";

export class CompetitorController {
    constructor(
        private jwtAuthenticator: JwtAuthenticator,
        private getCompetitorsUseCase: GetCompetitorsUseCase,
        private getCompetitorByIdUseCase: GetCompetitorByIdUseCase,
        private createCompetitorUseCase: CreateCompetitorUseCase,
        private updateCompetitorUseCase: UpdateCompetitorUseCase,
        private deleteCompetitorUseCase: DeleteCompetitorUseCase
    ) {}

    async getAll(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runGetAll(request, h, this.jwtAuthenticator, userId =>
            this.getCompetitorsUseCase.execute({ userId })
        );
    }

    async get(request: hapi.Request, h: hapi.ResponseToolkit): Promise<hapi.Lifecycle.ReturnValue> {
        return runGet(request, h, this.jwtAuthenticator, (userId: string, id: string) =>
            this.getCompetitorByIdUseCase.execute({ userId, id })
        );
    }

    async post(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runPost(request, h, this.jwtAuthenticator, (userId: string, data: CompetitorData) =>
            this.createCompetitorUseCase.execute({ userId, data })
        );
    }

    async put(request: hapi.Request, h: hapi.ResponseToolkit): Promise<hapi.Lifecycle.ReturnValue> {
        return runPut(
            request,
            h,
            this.jwtAuthenticator,
            (userId: string, id: string, data: CompetitorData) =>
                this.updateCompetitorUseCase.execute({ userId, id, data })
        );
    }

    async delete(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runDelete(request, h, this.jwtAuthenticator, (userId: string, id: string) =>
            this.deleteCompetitorUseCase.execute({ userId, id })
        );
    }
}
