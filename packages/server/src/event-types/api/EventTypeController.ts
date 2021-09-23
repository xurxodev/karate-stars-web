import { GetEventTypesUseCase } from "../domain/usecases/GetEventTypesUseCase";
import { JwtAuthenticator } from "../../server";
import { EventTypeData } from "karate-stars-core";
import { runDelete, runGet, runGetAll, runPost, runPut } from "../../common/api/AdminController";
import { GetEventTypeByIdUseCase } from "../domain/usecases/GetEventTypeByIdUseCase";
import { CreateEventTypeUseCase } from "../domain/usecases/CreateEventTypeUseCase";
import { UpdateEventTypeUseCase } from "../domain/usecases/UpdateEventTypeUseCase";
import { DeleteEventTypeUseCase } from "../domain/usecases/DeleteEventTypeUseCase";
import * as hapi from "@hapi/hapi";

export class EventTypeController {
    constructor(
        private jwtAuthenticator: JwtAuthenticator,
        private getEventTypesUseCase: GetEventTypesUseCase,
        private getEventTypeByIdUseCase: GetEventTypeByIdUseCase,
        private createEventTypeUseCase: CreateEventTypeUseCase,
        private updateEventTypeUseCase: UpdateEventTypeUseCase,
        private deleteEventTypeUseCase: DeleteEventTypeUseCase
    ) {}

    async getAll(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runGetAll(request, h, this.jwtAuthenticator, _userId =>
            this.getEventTypesUseCase.execute()
        );
    }

    async get(request: hapi.Request, h: hapi.ResponseToolkit): Promise<hapi.Lifecycle.ReturnValue> {
        return runGet(request, h, this.jwtAuthenticator, (_userId: string, id: string) =>
            this.getEventTypeByIdUseCase.execute({ id })
        );
    }

    async post(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runPost(request, h, this.jwtAuthenticator, (userId: string, data: EventTypeData) =>
            this.createEventTypeUseCase.execute({ userId, data })
        );
    }

    async put(request: hapi.Request, h: hapi.ResponseToolkit): Promise<hapi.Lifecycle.ReturnValue> {
        return runPut(
            request,
            h,
            this.jwtAuthenticator,
            (userId: string, id: string, data: EventTypeData) =>
                this.updateEventTypeUseCase.execute({ userId, id, data })
        );
    }

    async delete(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runDelete(request, h, this.jwtAuthenticator, (userId: string, id: string) =>
            this.deleteEventTypeUseCase.execute({ userId, id })
        );
    }
}
