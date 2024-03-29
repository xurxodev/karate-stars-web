import axios from "axios";
import Parser from "rss-parser";
import RankingDataSource from "../importers/RankingImporter";
import convert from "xml2js";
import { Category, Id, Ranking, RankingEntry, Url } from "karate-stars-core";

export default class SportdataRankingDataSource implements RankingDataSource {
    public parser = new Parser();

    public async get(ranking: Ranking, categories: Category[]): Promise<RankingEntry[]> {
        try {
            const rankingEntries = await this.getRankingEntries(ranking, categories);

            return rankingEntries;
        } catch (error) {
            console.log(`ranking entries error: ${error}`);
            return [];
        }
    }

    private async getRankingEntries(
        ranking: Ranking,
        categories: Category[]
    ): Promise<RankingEntry[]> {
        if (!ranking.apiUrl) {
            console.log(`apiUrl is empty`);
            return [];
        }
        if (!ranking.categoryParameter) {
            console.log(`categoryParameter is empty`);
            return [];
        }

        const apiUrl = ranking.apiUrl;
        const categoryParameter = ranking.categoryParameter;

        try {
            const entries = (
                await Promise.all(
                    ranking.categories.map(catId => {
                        const category = categories.find(
                            category => category.id.value === catId.value
                        );

                        if (!category) {
                            console.log(`category ${catId} not found`);
                            return [];
                        }

                        if (!category.wkfId) {
                            console.log(`category ${catId} has not wkfId`);
                            return [];
                        }

                        return this.getRankingEntriesByCategory(
                            ranking.id,
                            apiUrl,
                            categoryParameter,
                            category.id,
                            category.wkfId
                        );
                    })
                )
            ).flat();

            return entries;
        } catch (error) {
            console.log(`Error parsing ranking  ${{ ranking }}`);
            return [];
        }
    }

    private async getRankingEntriesByCategory(
        rankingId: Id,
        apiUrl: Url,
        categoryParameter: string,
        categoryId: Id,
        categoryWkfId: string
    ): Promise<RankingEntry[]> {
        try {
            const response = await axios.get(apiUrl.value, {
                params: {
                    [categoryParameter]: categoryWkfId,
                },
            });

            const data = await convert.parseStringPromise(response.data, { explicitArray: false });

            return this.mapResponseToRankingEntries(data, rankingId, categoryId);
        } catch (error) {
            console.log(`Error parsing entries for category ${categoryWkfId}: \n${error}`);
            return [];
        }
    }

    private mapResponseToRankingEntries(data: any, rankingId: Id, categoryId: Id): RankingEntry[] {
        if (Array.isArray(data.Filereport.RankingEntry)) {
            return data.Filereport.RankingEntry.map((item: any) => {
                return this.mapItemToRankingEntry(item, rankingId, categoryId);
            });
        } else {
            return [
                this.mapItemToRankingEntry(data.Filereport.RankingEntry, rankingId, categoryId),
            ];
        }
    }

    private mapItemToRankingEntry(entry: any, rankingId: Id, categoryId: Id): RankingEntry {
        return RankingEntry.create({
            id: Id.generateId().value,
            rankingId: rankingId.value,
            rank: +entry.Rank,
            country: entry.Country,
            countryCode: entry.CountryCode,
            name: entry.Name,
            firstName: entry.Firstname,
            lastName: entry.Lastname,
            wkfId: entry.WKFID,
            photo: entry.PHOTO,
            totalPoints: +entry.TotalPoints,
            continentalCode: entry.ContinentCode,
            categoryId: categoryId.value,
            categoryWkfId: entry.CATID,
        }).get();
    }
}
