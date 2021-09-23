import { GetVideosUseCase } from "../domain/usecases/GetVideosUseCase";
import { JwtAuthenticator } from "../../server";
import { VideoData } from "karate-stars-core";
import { runDelete, runGet, runGetAll, runPost, runPut } from "../../common/api/AdminController";
import { GetVideoByIdUseCase } from "../domain/usecases/GetVideoByIdUseCase";
import { CreateVideoUseCase } from "../domain/usecases/CreateVideoUseCase";
import { UpdateVideoUseCase } from "../domain/usecases/UpdateVideoUseCase";
import { DeleteVideoUseCase } from "../domain/usecases/DeleteVideoUseCase";
import * as hapi from "@hapi/hapi";

export class VideoController {
    constructor(
        private jwtAuthenticator: JwtAuthenticator,
        private getVideosUseCase: GetVideosUseCase,
        private getVideoByIdUseCase: GetVideoByIdUseCase,
        private createVideoUseCase: CreateVideoUseCase,
        private updateVideoUseCase: UpdateVideoUseCase,
        private deleteVideoUseCase: DeleteVideoUseCase
    ) {}

    async getAll(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runGetAll(request, h, this.jwtAuthenticator, _userId => this.getVideosUseCase.run());
    }

    async get(request: hapi.Request, h: hapi.ResponseToolkit): Promise<hapi.Lifecycle.ReturnValue> {
        return runGet(request, h, this.jwtAuthenticator, (_userId: string, id: string) =>
            this.getVideoByIdUseCase.execute({ id })
        );
    }

    async post(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runPost(request, h, this.jwtAuthenticator, (userId: string, data: VideoData) =>
            this.createVideoUseCase.execute({ userId, data })
        );
    }

    async put(request: hapi.Request, h: hapi.ResponseToolkit): Promise<hapi.Lifecycle.ReturnValue> {
        return runPut(
            request,
            h,
            this.jwtAuthenticator,
            (userId: string, id: string, data: VideoData) =>
                this.updateVideoUseCase.execute({ userId, id, data })
        );
    }

    async delete(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runDelete(request, h, this.jwtAuthenticator, (userId: string, id: string) =>
            this.deleteVideoUseCase.execute({ userId, id })
        );
    }
}
