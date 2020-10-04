import { DataError } from "../domain/Errors";
import { AxiosInstance } from "axios";
import { Either } from "karate-stars-core";
import { TokenStorage } from "./TokenLocalStorage";

class ApiRepository<T> {
    constructor(private axiosInstance: AxiosInstance, private tokenStorage: TokenStorage) {}

    async get(endpoint: string): Promise<Either<DataError, T>> {
        try {
            const token = this.tokenStorage.get();

            if (!token) {
                return Either.left({ kind: "Unauthorized" });
            }

            const response = await this.axiosInstance.get<T>(endpoint, {
                headers: { authorization: token },
            });

            return Either.right(response.data);
        } catch (error) {
            return Either.left(this.handleError(error));
        }
    }

    private handleError(error: any): DataError {
        if (error.response?.data?.statusCode) {
            return error.response.data.statusCode === 401
                ? { kind: "Unauthorized" }
                : {
                      kind: "ApiError",
                      error: error.response.data.error,
                      statusCode: error.response.data.statusCode,
                      message: error.response.data.message,
                  };
        } else if (typeof error.response?.data === "string") {
            return { kind: "UnexpectedError", message: error.response.data };
        } else {
            return { kind: "UnexpectedError", message: error.message };
        }
    }
}

export default ApiRepository;
