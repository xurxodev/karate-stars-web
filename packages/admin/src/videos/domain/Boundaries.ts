import { Either, Id, Video } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export interface VideoRepository {
    getAll(): Promise<Either<DataError, Video[]>>;
    getById(id: Id): Promise<Either<DataError, Video>>;
    deleteById(id: Id): Promise<Either<DataError, true>>;
    save(entity: Video): Promise<Either<DataError, true>>;
    saveImage(entityId: Id, file: File): Promise<Either<DataError, true>>;
}
