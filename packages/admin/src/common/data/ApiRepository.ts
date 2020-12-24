import { DataError } from "../domain/Errors";
import { AxiosInstance } from "axios";
import { Either } from "karate-stars-core";
import { TokenStorage } from "./TokenLocalStorage";

class ApiRepository<T> {
    constructor(private axiosInstance: AxiosInstance, private tokenStorage: TokenStorage) {}

    async getMany(endpoint: string): Promise<Either<DataError, T[]>> {
        try {
            const token = this.tokenStorage.get();

            if (!token) {
                return Either.left({ kind: "Unauthorized" });
            }

            const response = await this.axiosInstance.get<T[]>(endpoint, {
                headers: { authorization: token },
            });

            return Either.right(response.data);
        } catch (error) {
            return Either.left(this.handleError(error));
        }
    }

    async getOne(endpoint: string): Promise<Either<DataError, T>> {
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

    async delete(endpoint: string): Promise<Either<DataError, true>> {
        try {
            const token = this.tokenStorage.get();

            if (!token) {
                return Either.left({ kind: "Unauthorized" });
            }

            await this.axiosInstance.delete<T>(endpoint, {
                headers: { authorization: token },
            });

            return Either.right(true);
        } catch (error) {
            return Either.left(this.handleError(error));
        }
    }

    async postOrPut(baseEndpoint: string, id: string, item: T): Promise<Either<DataError, true>> {
        try {
            const feedResult = await this.getOne(`${baseEndpoint}/${id}`);

            return feedResult.fold<Promise<Either<DataError, true>>>(
                async error => {
                    if (error.kind === "ApiError" && error.statusCode === 404) {
                        return await this.post(`${baseEndpoint}`, item);
                    } else {
                        return Either.left(error as DataError);
                    }
                },
                async _ => await this.put(`${baseEndpoint}/${id}`, item)
            );
        } catch (error) {
            return Either.left(this.handleError(error));
        }
    }

    async putImage(baseEndpoint: string, id: string, file: File): Promise<Either<DataError, true>> {
        try {
            const token = this.tokenStorage.get();

            if (!token) {
                return Either.left({ kind: "Unauthorized" });
            }

            const formdata = new FormData();
            formdata.append("file", file);

            await this.axiosInstance.put<T>(`${baseEndpoint}/${id}/image`, formdata, {
                headers: { authorization: token },
            });

            return Either.right(true);
        } catch (error) {
            return Either.left(this.handleError(error));
        }
    }

    async post(endpoint: string, item: T): Promise<Either<DataError, true>> {
        try {
            const token = this.tokenStorage.get();

            if (!token) {
                return Either.left({ kind: "Unauthorized" });
            }

            await this.axiosInstance.post<T>(endpoint, item, {
                headers: { authorization: token },
            });

            return Either.right(true);
        } catch (error) {
            return Either.left(this.handleError(error));
        }
    }

    async put(endpoint: string, item: T): Promise<Either<DataError, true>> {
        try {
            const token = this.tokenStorage.get();

            if (!token) {
                return Either.left({ kind: "Unauthorized" });
            }

            await this.axiosInstance.put<T>(endpoint, item, {
                headers: { authorization: token },
            });

            return Either.right(true);
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
