import { Either, Id, EventType } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export interface EventTypeRepository {
    getAll(): Promise<Either<DataError, EventType[]>>;
    getById(id: Id): Promise<Either<DataError, EventType>>;
    deleteById(id: Id): Promise<Either<DataError, true>>;
    save(entity: EventType): Promise<Either<DataError, true>>;
    saveImage(entityId: Id, file: File): Promise<Either<DataError, true>>;
}
