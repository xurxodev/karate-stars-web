import { DataError } from "../domain/Errors";
import { AxiosInstance } from "axios";
import { Either, Id } from "karate-stars-core";
import { TokenStorage } from "./TokenLocalStorage";
import { Entity, EntityData } from "karate-stars-core/build/entities/Entity";

abstract class ApiRepository<TEntity extends Entity<TEntityData>, TEntityData extends EntityData> {
    constructor(
        private axiosInstance: AxiosInstance,
        private tokenStorage: TokenStorage,
        private endpoint: string
    ) {}

    protected abstract mapToDomain(data: TEntityData): TEntity;

    async getAll(): Promise<Either<DataError, TEntity[]>> {
        try {
            const token = this.tokenStorage.get();

            if (!token) {
                return Either.left({ kind: "Unauthorized" });
            }

            const response = await this.axiosInstance.get<TEntityData[]>(`${this.endpoint}`, {
                headers: { authorization: token },
            });

            const result = Either.right<DataError, TEntity[]>(
                response.data.map(item => this.mapToDomain(item))
            );

            return result;
        } catch (error) {
            return Either.left(this.handleError(error));
        }
    }

    async getById(id: Id): Promise<Either<DataError, TEntity>> {
        try {
            const token = this.tokenStorage.get();

            if (!token) {
                return Either.left({ kind: "Unauthorized" });
            }

            const response = await this.axiosInstance.get<TEntityData>(
                `${this.endpoint}/${id.value}`,
                {
                    headers: { authorization: token },
                }
            );

            return Either.right(this.mapToDomain(response.data));
        } catch (error) {
            return Either.left(this.handleError(error));
        }
    }

    async deleteById(id: Id): Promise<Either<DataError, true>> {
        try {
            const token = this.tokenStorage.get();

            if (!token) {
                return Either.left({ kind: "Unauthorized" });
            }

            await this.axiosInstance.delete(`${this.endpoint}/${id.value}`, {
                headers: { authorization: token },
            });

            return Either.right(true);
        } catch (error) {
            return Either.left(this.handleError(error));
        }
    }

    async save(entity: TEntity): Promise<Either<DataError, true>> {
        try {
            debugger;
            const result = await this.getById(entity.id);

            return result.fold<Promise<Either<DataError, true>>>(
                async error => {
                    if (error.kind === "ApiError" && error.statusCode === 404) {
                        return await this.post(`${this.endpoint}`, entity.toData());
                    } else {
                        return Either.left(error as DataError);
                    }
                },
                async () => await this.put(`${this.endpoint}/${entity.id.value}`, entity.toData())
            );
        } catch (error) {
            return Either.left(this.handleError(error));
        }
    }

    async saveImage(entityId: Id, file: File): Promise<Either<DataError, true>> {
        try {
            const token = this.tokenStorage.get();

            if (!token) {
                return Either.left({ kind: "Unauthorized" });
            }

            const formdata = new FormData();
            formdata.append("file", file);

            await this.axiosInstance.put(`${this.endpoint}/${entityId.value}/image`, formdata, {
                headers: { authorization: token },
            });

            return Either.right(true);
        } catch (error) {
            return Either.left(this.handleError(error));
        }
    }

    private async post(endpoint: string, item: TEntityData): Promise<Either<DataError, true>> {
        try {
            const token = this.tokenStorage.get();

            if (!token) {
                return Either.left({ kind: "Unauthorized" });
            }

            await this.axiosInstance.post(endpoint, item, {
                headers: { authorization: token },
            });

            return Either.right(true);
        } catch (error) {
            return Either.left(this.handleError(error));
        }
    }

    private async put(endpoint: string, item: TEntityData): Promise<Either<DataError, true>> {
        try {
            const token = this.tokenStorage.get();

            if (!token) {
                return Either.left({ kind: "Unauthorized" });
            }

            await this.axiosInstance.put(endpoint, item, {
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
