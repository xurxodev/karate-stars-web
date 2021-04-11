import { GetEventsUseCase } from "../domain/usecases/GetEventsUseCase";
import { JwtAuthenticator } from "../../server";
import { EventData } from "karate-stars-core";
import { runDelete, runGet, runGetAll, runPost, runPut } from "../../common/api/AdminController";
import { GetEventByIdUseCase } from "../domain/usecases/GetEventByIdUseCase";
import { CreateEventUseCase } from "../domain/usecases/CreateEventUseCase";
import { UpdateEventUseCase } from "../domain/usecases/UpdateEventUseCase";
import { DeleteEventUseCase } from "../domain/usecases/DeleteEventUseCase";
import * as hapi from "@hapi/hapi";

export class EventController {
    constructor(
        private jwtAuthenticator: JwtAuthenticator,
        private getEventsUseCase: GetEventsUseCase,
        private getEventByIdUseCase: GetEventByIdUseCase,
        private createEventUseCase: CreateEventUseCase,
        private updateEventUseCase: UpdateEventUseCase,
        private deleteEventUseCase: DeleteEventUseCase
    ) {}

    async getAll(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runGetAll(request, h, this.jwtAuthenticator, userId =>
            this.getEventsUseCase.execute({ userId })
        );
    }

    async get(request: hapi.Request, h: hapi.ResponseToolkit): Promise<hapi.Lifecycle.ReturnValue> {
        return runGet(request, h, this.jwtAuthenticator, (userId: string, id: string) =>
            this.getEventByIdUseCase.execute({ userId, id })
        );
    }

    async post(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runPost(request, h, this.jwtAuthenticator, (userId: string, data: EventData) =>
            this.createEventUseCase.execute({ userId, data })
        );
    }

    async put(request: hapi.Request, h: hapi.ResponseToolkit): Promise<hapi.Lifecycle.ReturnValue> {
        return runPut(
            request,
            h,
            this.jwtAuthenticator,
            (userId: string, id: string, data: EventData) =>
                this.updateEventUseCase.execute({ userId, id, data })
        );
    }

    async delete(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runDelete(request, h, this.jwtAuthenticator, (userId: string, id: string) =>
            this.deleteEventUseCase.execute({ userId, id })
        );
    }
}
