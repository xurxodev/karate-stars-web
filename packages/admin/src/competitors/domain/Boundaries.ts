import { Either, Id, Competitor } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export interface CompetitorRepository {
    getAll(): Promise<Either<DataError, Competitor[]>>;
    getById(id: Id): Promise<Either<DataError, Competitor>>;
    deleteById(id: Id): Promise<Either<DataError, true>>;
    save(competirtor: Competitor): Promise<Either<DataError, true>>;
    saveImage(newsFeedId: Id, file: File): Promise<Either<DataError, true>>;
}
