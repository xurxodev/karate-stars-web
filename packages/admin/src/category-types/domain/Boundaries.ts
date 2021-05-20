import { Either, Id, CategoryType } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export interface CategoryTypeRepository {
    getAll(): Promise<Either<DataError, CategoryType[]>>;
    getById(id: Id): Promise<Either<DataError, CategoryType>>;
    deleteById(id: Id): Promise<Either<DataError, true>>;
    save(entity: CategoryType): Promise<Either<DataError, true>>;
    saveImage(entityId: Id, file: File): Promise<Either<DataError, true>>;
}
