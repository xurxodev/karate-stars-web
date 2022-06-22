import { Ranking } from "../entities/Ranking";

export default interface RankingRepository {
    getAll(toImport?: true): Promise<Ranking[]>;
}
