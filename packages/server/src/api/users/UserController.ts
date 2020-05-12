
import * as boom from "@hapi/boom";
import * as hapi from "@hapi/hapi";
import GetUserByIdUseCase from "../../domain/users/usecases/GetUserByIdUseCase";
import GetUserByUsernameUseCase from "../../domain/users/usecases/GetUserByUsernameUseCase";
import jwtAuthentication from "./JwtAuthentication";
import User from "../../domain/users/entities/User";

export default class ProductController {

    constructor(
        private getUserByUsernameUseCase: GetUserByUsernameUseCase,
        private getUserByIdUseCase: GetUserByIdUseCase) { }

    public login(request: hapi.Request, h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        const credentials: any = request.payload;

        if (credentials) {
            return this.getUserByUsernameUseCase.execute(credentials.username)
                .then((user: User) => {
                    if (user.password === credentials.password) {
                        const response = h.response(this.mapUser(user));
                        const token = jwtAuthentication.generateToken(user);
                        response.header("Authorization", `Bearer ${token}`);
                        return response;
                    } else {
                        return boom.unauthorized("Invalid credentials");
                    }
                }).catch((error) => {
                    return boom.unauthorized("Invalid credentials");
                });
        } else {
            return boom.badRequest("username and password are required in login body request");
        }
    }

    public getCurrentUser(request: hapi.Request, h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        const token = request.headers.authorization;

        const userId = jwtAuthentication.decodeToken(token.replace("Bearer ", "")).userId;

        console.log({ userId });

        return this.getUserByIdUseCase.execute(userId)
            .then((user) => {
                if (user) {
                    return h.response(this.mapUser(user));
                } else {
                    return boom.unauthorized("Invalid credentials");
                }
            }).catch((error) => {
                return boom.unauthorized("Invalid credentials");
            });
    }

    private mapUser(user: User) {
        return { userId: user.userId, name: user.name, username: user.username };
    }
}
