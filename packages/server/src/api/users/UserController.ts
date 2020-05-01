
import * as boom from "@hapi/boom";
import * as hapi from "@hapi/hapi";
import GetUserByUsernameUseCase from "../../domain/users/usecases/GetUserByUsernameUseCase";
import jwtAuthentication from "./JwtAuthentication";

export default class ProductController {

    private getUserByUsernameUseCase: GetUserByUsernameUseCase;

    constructor(getUserByUsernameUseCase: GetUserByUsernameUseCase) {
        this.getUserByUsernameUseCase = getUserByUsernameUseCase;
    }

    public login(request: hapi.Request, h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        const credentials: any = request.payload;

        if (credentials) {
            return this.getUserByUsernameUseCase.execute(credentials.username)
                .then((user) => {
                    if (user.password === credentials.password) {
                        const response = h.response({ userId: user.userId });
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
}
