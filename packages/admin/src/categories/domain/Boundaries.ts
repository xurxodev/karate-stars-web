import { Either, Id, Category } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export interface CategoryRepository {
    getAll(): Promise<Either<DataError, Category[]>>;
    getById(id: Id): Promise<Either<DataError, Category>>;
    deleteById(id: Id): Promise<Either<DataError, true>>;
    save(entity: Category): Promise<Either<DataError, true>>;
    saveImage(entityId: Id, file: File): Promise<Either<DataError, true>>;
}
