import { Email } from "../domain/entities/Email";
import { Password } from "../domain/entities/Password";
import { Either } from "../../common/domain/Either";
import { UserError } from "../domain/Errors";
import User from "../domain/entities/User";
import UserRepository from "../domain/Boundaries";
import { AxiosInstance } from "axios";

export default class UserApiRepository implements UserRepository {
    constructor(private axiosInstance: AxiosInstance) { }

    async getByEmailAndPassword(email: Email, password: Password): Promise<Either<UserError, User>> {
        try {
            const response = await this.axiosInstance.post<User>("/login", {
                username: email.value,
                password: password.value
            });

            return Either.right(response.data);
        } catch (error) {
            if (error.response?.data?.statusCode) {
                return Either.left(
                    {
                        kind: "ApiError",
                        error: error.response.data.error,
                        statusCode: error.response.data.statusCode,
                        message: error.response.data.message
                    });
            } else if (typeof error.response?.data === "string") {
                return Either.left({ kind: "UnexpectedError", message: error.response.data })
            }
            else {
                return Either.left({ kind: "UnexpectedError", message: error.message });
            }
        }
    }
}