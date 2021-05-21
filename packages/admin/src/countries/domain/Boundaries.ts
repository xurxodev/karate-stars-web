import { Either, Id, Country } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export interface CountryRepository {
    getAll(): Promise<Either<DataError, Country[]>>;
    getById(id: Id): Promise<Either<DataError, Country>>;
    deleteById(id: Id): Promise<Either<DataError, true>>;
    save(entity: Country): Promise<Either<DataError, true>>;
    saveImage(entityId: Id, file: File): Promise<Either<DataError, true>>;
}
