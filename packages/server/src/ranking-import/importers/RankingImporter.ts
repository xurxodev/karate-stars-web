import { Category, Ranking, RankingEntry } from "karate-stars-core";
import CategoryMongoRepository from "../../categories/data/CategoryMongoRepository";
import { MongoConector } from "../../common/data/MongoConector";
import SportdataRankingDataSource from "../dataSources/SportdataRankingDataSource";
import RankingMongoRepository from "../../ranking/data/RankingMongoRepository";
import RankingEntryMongoRepository from "../../ranking/data/RankingEntryMongoRepository";

export default interface RankingDataSource {
    get(ranking: Ranking, categories: Category[]): Promise<RankingEntry[]>;
}

export class RankingImporter {
    constructor(private mongoConector: MongoConector) {}

    async execute() {
        try {
            console.log(`Initializing ranking importer`);

            const rankingRepository = new RankingMongoRepository(this.mongoConector);
            const rankingEntryRepository = new RankingEntryMongoRepository(this.mongoConector);
            const categoryRepository = new CategoryMongoRepository(this.mongoConector);
            const dataSource = new SportdataRankingDataSource();

            const rankings = await rankingRepository.get({ toImport: true });
            const categories = await categoryRepository.getAll();

            const rankingEntries = (
                await Promise.all(
                    rankings.map(ranking => {
                        return dataSource.get(ranking, categories);
                    })
                )
            ).flat();

            console.log(`Total ranking entries ${rankingEntries.length}`);

            const result = await rankingEntryRepository.replaceAll(rankingEntries);

            result.fold(
                error => {
                    console.log(`Save ranking entries failed: \n "${error}`);
                },
                () => {
                    console.log("Save ranking entries finished successfully!!");
                }
            );
        } catch (error) {
            console.log(`An error has ocurred importing ranking entries` + error);
        }
    }
}
