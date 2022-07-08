import { Either, Ranking } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export interface RankingRepository {
    getAll(): Promise<Either<DataError, Ranking[]>>;
}
