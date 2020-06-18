import * as boom from "@hapi/boom";
import * as hapi from "@hapi/hapi";
import GetUserByIdUseCase from "../../domain/users/usecases/GetUserByIdUseCase";
import GetUserByUsernameUseCase from "../../domain/users/usecases/GetUserByUsernameAndPasswordUseCase";
import jwtAuthentication from "./JwtAuthentication";
import { User, Maybe } from "karate-stars-core";

export default class UserController {
    constructor(
        private getUserByUsernameUseCase: GetUserByUsernameUseCase,
        private getUserByIdUseCase: GetUserByIdUseCase
    ) {}

    public login(request: hapi.Request, h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        const credentials: any = request.payload;

        if (credentials) {
            return this.getUserByUsernameUseCase
                .execute(credentials.username, credentials.password)
                .then((result: Maybe<User>) => {
                    if (result.isDefined()) {
                        const response = h.response(result.get());
                        const token = jwtAuthentication.generateToken(result.get());
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
        const token = request.headers.authorization;

        const userId = jwtAuthentication.decodeToken(token.replace("Bearer ", "")).userId;

        return this.getUserByIdUseCase
            .execute(userId)
            .then(result => {
                if (result.isDefined()) {
                    return h.response(result.get());
                } else {
                    return boom.unauthorized("Invalid credentials");
                }
            })
            .catch(() => {
                return boom.unauthorized("Invalid credentials");
            });
    }
}
