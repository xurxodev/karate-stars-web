import { Either, Left, Email, Password } from "karate-stars-core";
import { GetUserError } from "../domain/Errors";
import User from "../domain/entities/User";
import UserRepository from "../domain/Boundaries";
import { AxiosInstance } from "axios";
import { TokenStorage } from "../../common/data/TokenLocalStorage";

export default class UserApiRepository implements UserRepository {
    constructor(private axiosInstance: AxiosInstance, private tokenStorage: TokenStorage) {}

    async getByEmailAndPassword(
        email: Email,
        password: Password
    ): Promise<Either<GetUserError, User>> {
        try {
            const response = await this.axiosInstance.post<User>("/login", {
                username: email.value,
                password: password.value,
            });

            const token = response.headers["authorization"];
            this.tokenStorage.save(token);

            return Either.right(response.data);
        } catch (error) {
            return this.handleError(error);
        }
    }

    async getCurrent(): Promise<Either<GetUserError, User>> {
        try {
            const token = this.tokenStorage.get();

            if (!token) {
                return Either.left({ kind: "Unauthorized" });
            }

            const response = await this.axiosInstance.get<User>("/me", {
                headers: { authorization: token },
            });

            return Either.right(response.data);
        } catch (error) {
            return this.handleError(error);
        }
    }

    async removeCurrent(): Promise<void> {
        this.tokenStorage.save("");
    }

    private handleError(error: any): Left<GetUserError> {
        if (error.response?.data?.statusCode) {
            return error.response.data.statusCode === 401
                ? Either.left({ kind: "Unauthorized" })
                : Either.left({
                      kind: "ApiError",
                      error: error.response.data.error,
                      statusCode: error.response.data.statusCode,
                      message: error.response.data.message,
                  });
        } else if (typeof error.response?.data === "string") {
            return Either.left({ kind: "UnexpectedError", message: error.response.data });
        } else {
            return Either.left({ kind: "UnexpectedError", message: error.message });
        }
    }
}
