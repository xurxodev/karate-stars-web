import { Either, Id, Event } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export interface EventRepository {
    getAll(): Promise<Either<DataError, Event[]>>;
    getById(id: Id): Promise<Either<DataError, Event>>;
    deleteById(id: Id): Promise<Either<DataError, true>>;
    save(entity: Event): Promise<Either<DataError, true>>;
    saveImage(entityId: Id, file: File): Promise<Either<DataError, true>>;
}
