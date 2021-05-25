import * as hapi from "@hapi/hapi";
import { GetNewsFeedsUseCase } from "../domain/usecases/GetNewsFeedsUseCase";
import { JwtAuthenticator } from "../../server";
import { DeleteNewsFeedUseCase } from "../domain/usecases/DeleteNewsFeedUseCase";
import { NewsFeedData } from "karate-stars-core";
import { CreateNewsFeedUseCase } from "../domain/usecases/CreateNewsFeedUseCase";
import { UpdateNewsFeedUseCase } from "../domain/usecases/UpdateNewsFeedUseCase";
import { UpdateNewsFeedImageUseCase } from "../domain/usecases/UpdateNewsFeedImageUseCase";
import { Readable } from "stream";
import { GetNewsFeedByIdUseCase } from "../domain/usecases/GetNewsFeedByIdUseCase";
import {
    runDelete,
    runGet,
    runGetAll,
    runPost,
    runPut,
    runPutImage,
} from "../../common/api/AdminController";

export default class NewsFeedsController {
    constructor(
        private jwtAuthenticator: JwtAuthenticator,
        private getNewsFeedsUseCase: GetNewsFeedsUseCase,
        private getNewsFeedByIdUseCase: GetNewsFeedByIdUseCase,
        private createNewsFeedUseCase: CreateNewsFeedUseCase,
        private updateNewsFeedUseCase: UpdateNewsFeedUseCase,
        private updateNewsFeedImageUseCase: UpdateNewsFeedImageUseCase,
        private deleteNewsFeedUseCase: DeleteNewsFeedUseCase
    ) {}

    async getAll(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runGetAll(request, h, this.jwtAuthenticator, userId =>
            this.getNewsFeedsUseCase.execute({ userId })
        );
    }

    async get(request: hapi.Request, h: hapi.ResponseToolkit): Promise<hapi.Lifecycle.ReturnValue> {
        return runGet(request, h, this.jwtAuthenticator, (userId: string, id: string) =>
            this.getNewsFeedByIdUseCase.execute({ userId, id })
        );
    }

    async delete(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runDelete(request, h, this.jwtAuthenticator, (userId: string, id: string) =>
            this.deleteNewsFeedUseCase.execute({ userId, id })
        );
    }

    async post(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runPost(request, h, this.jwtAuthenticator, (userId: string, data: NewsFeedData) => {
            return this.createNewsFeedUseCase.execute({ userId, data });
        });
    }

    async put(request: hapi.Request, h: hapi.ResponseToolkit): Promise<hapi.Lifecycle.ReturnValue> {
        return runPut(
            request,
            h,
            this.jwtAuthenticator,
            (userId: string, id: string, data: NewsFeedData) =>
                this.updateNewsFeedUseCase.execute({ userId, id, data })
        );
    }

    async putImage(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): Promise<hapi.Lifecycle.ReturnValue> {
        return runPutImage(
            request,
            h,
            this.jwtAuthenticator,
            (userId: string, id: string, image: Readable, filename: string) =>
                this.updateNewsFeedImageUseCase.execute({
                    userId,
                    id,
                    image,
                    filename,
                })
        );
    }
}
