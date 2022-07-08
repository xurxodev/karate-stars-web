import { di, appDIKeys } from "../CompositionRoot";
import RankingApiRepository from "./data/RankingApiRepository";
import { RankingRepository } from "./domain/Boundaries";
import GetRankingsUseCase from "./domain/GetRankingsUseCase";

export const rankingDIKeys = {
    rankingRepository: "rankingRepository",
};

export function initRankings() {
    di.bindLazySingleton(
        rankingDIKeys.rankingRepository,
        () =>
            new RankingApiRepository(
                di.get(appDIKeys.axiosInstanceAPI),
                di.get(appDIKeys.tokenStorage)
            )
    );

    di.bindLazySingleton(
        GetRankingsUseCase,
        () => new GetRankingsUseCase(di.get<RankingRepository>(rankingDIKeys.rankingRepository))
    );
}
