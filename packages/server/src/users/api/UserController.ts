import * as boom from "@hapi/boom";
import * as hapi from "@hapi/hapi";

import { Maybe, UserData } from "karate-stars-core";
import { UserAPI } from "./UserAPI";
import { JwtAuthenticator } from "../../server";
import GetUserByUsernameAndPasswordUseCase from "../domain/usecases/GetUserByUsernameAndPasswordUseCase";
import GetUserByIdUseCase from "../domain/usecases/GetUserByIdUseCase";

export default class UserController {
    constructor(
        private jwtAuthenticator: JwtAuthenticator,
        private getUserByUsernameAndPasswordUseCase: GetUserByUsernameAndPasswordUseCase,
        private getUserByIdUseCase: GetUserByIdUseCase
    ) {}

    public login(request: hapi.Request, h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        const credentials: any = request.payload;

        if (credentials) {
            return this.getUserByUsernameAndPasswordUseCase
                .execute(credentials.username, credentials.password)
                .then((result: Maybe<UserData>) => {
                    if (result.isDefined()) {
                        const response = h.response(this.mapToAPI(result.get()));
                        const token = this.jwtAuthenticator.generateToken(result.get().id);
                        response.header("Authorization", `Bearer ${token}`);
                        return response;
                    } else {
                        return boom.unauthorized("Invalid credentials");
                    }
                })
                .catch(() => {
                    return boom.unauthorized("Invalid credentials");
                });
        } else {
            return boom.badRequest("username and password are required in login body request");
        }
    }

    public getCurrentUser(
        request: hapi.Request,
        h: hapi.ResponseToolkit
    ): hapi.Lifecycle.ReturnValue {
        const { userId } = this.jwtAuthenticator.decodeTokenData(request.headers.authorization);

        return this.getUserByIdUseCase
            .execute(userId)
            .then(result => {
                if (result.isDefined()) {
                    return h.response(this.mapToAPI(result.get()));
                } else {
                    return boom.unauthorized("Invalid credentials");
                }
            })
            .catch(() => {
                return boom.unauthorized("Invalid credentials");
            });
    }

    private mapToAPI(user: UserData): UserAPI {
        return {
            id: user.id.value,
            name: user.name,
            image: user.image,
            email: user.email.value,
            password: user.password.value,
            isAdmin: user.isAdmin,
            isClientUser: user.isClientUser,
        };
    }
}
