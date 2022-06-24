import { Either, Id, RankingEntryData } from "karate-stars-core";
import { ResourceNotFoundError } from "../../../common/api/Errors";
import RankingEntryRepository from "../boundaries/RankingEntryRepository";

export interface GetRankingEntriesArgs {
    rankingId: string;
    categoryId: string;
}

type GetRankingEntriesdError = ResourceNotFoundError;

export class GetRankingEntriesUseCase {
    constructor(private rankingEntryRepository: RankingEntryRepository) {}

    public async execute({
        rankingId,
        categoryId,
    }: GetRankingEntriesArgs): Promise<Either<GetRankingEntriesdError, RankingEntryData[]>> {
        const ranking = Id.createExisted(rankingId);
        const category = Id.createExisted(categoryId);

        if (ranking.isLeft() || category.isLeft()) {
            return Either.left({
                kind: "ResourceNotFound",
                message: `Ranking entry not found for rankingId ${rankingId} and category ${categoryId}`,
            } as ResourceNotFoundError);
        } else {
            const rankings = await this.rankingEntryRepository.get(ranking.get(), category.get());

            return Either.right(rankings.map(ranking => ranking.toData()));
        }
    }
}
