import { Either, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { UnexpectedError } from "../../../common/api/Errors";
import { RankingEntry } from "../entities/RankingEntry";

export default interface RankingEntryReadableRepository {
    get(rankingId: Id, categoryId: Id): Promise<RankingEntry[]>;
}

export interface RankingEntryWritableRepository {
    replaceAll(rankingEntries: RankingEntry[]): Promise<Either<UnexpectedError, ActionResult>>;
}
