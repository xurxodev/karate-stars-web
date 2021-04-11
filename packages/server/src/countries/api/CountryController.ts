import { GetCountriesUseCase } from "../domain/usecases/GetCountriesUseCase";
import { JwtAuthenticator } from "../../server";
import { CountryData } from "karate-stars-core";
import { runDelete, runGet, runGetAll, runPost, runPut } from "../../common/api/AdminController";
import { GetCountryByIdUseCase } from "../domain/usecases/GetCountryByIdUseCase";
import { CreateCountryUseCase } from "../domain/usecases/CreateCountryUseCase";
import { UpdateCountryUseCase } from "../domain/usecases/UpdateCountryUseCase";
import { DeleteCountryUseCase } from "../domain/usecases/DeleteCountryUseCase";
import * as hapi from "@hapi/hapi";

export class CountryController {
    constructor(
        private jwtAuthenticator: JwtAuthenticator,
        private getCountriesUseCase: GetCountriesUseCase,
        private getCountryByIdUseCase: GetCountryByIdUseCase,
        private createCountryUseCase: CreateCountryUseCase,
        private updateCountryUseCase: UpdateCountryUseCase,
        private deleteCountryUseCase: DeleteCountryUseCase
    ) {}

    async getAll(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runGetAll(request, h, this.jwtAuthenticator, userId =>
            this.getCountriesUseCase.execute({ userId })
        );
    }

    async get(request: hapi.Request, h: hapi.ResponseToolkit): Promise<hapi.Lifecycle.ReturnValue> {
        return runGet(request, h, this.jwtAuthenticator, (userId: string, id: string) =>
            this.getCountryByIdUseCase.execute({ userId, id })
        );
    }

    async post(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runPost(request, h, this.jwtAuthenticator, (userId: string, data: CountryData) =>
            this.createCountryUseCase.execute({ userId, data })
        );
    }

    async put(request: hapi.Request, h: hapi.ResponseToolkit): Promise<hapi.Lifecycle.ReturnValue> {
        return runPut(
            request,
            h,
            this.jwtAuthenticator,
            (userId: string, id: string, data: CountryData) =>
                this.updateCountryUseCase.execute({ userId, id, data })
        );
    }

    async delete(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runDelete(request, h, this.jwtAuthenticator, (userId: string, id: string) =>
            this.deleteCountryUseCase.execute({ userId, id })
        );
    }
}
