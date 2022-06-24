import { Ranking } from "karate-stars-core";

export default interface RankingRepository {
    getAll(toImport?: true): Promise<Ranking[]>;
}
