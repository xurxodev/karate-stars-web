import { MongoConector } from "../common/data/MongoConector";
import { appDIKeys, di } from "../CompositionRoot";
import { RankingController } from "./api/RankingController";
import { RankingEntryController } from "./api/RankingEntryController";
import RankingEntryMongoRepository from "./data/RankingEntryMongoRepository";
import RankingMongoRepository from "./data/RankingMongoRepository";
import RankingEntryRepository from "./domain/boundaries/RankingEntryRepository";
import RankingRepository from "./domain/boundaries/RankingRepository";
import { GetRankingEntriesUseCase } from "./domain/usecases/GetRankingEntriesUseCase";
import { GetRankingsUseCase } from "./domain/usecases/GetRankingsUseCase";

export const rankingDIKeys = {
    rankingRepository: "rankingRepository",
    rankingEntryRepository: "rankingEntryRepository",
};

export function initializeRankings() {
    di.bindLazySingleton(
        rankingDIKeys.rankingRepository,
        () => new RankingMongoRepository(di.get(MongoConector))
    );

    di.bindLazySingleton(
        rankingDIKeys.rankingEntryRepository,
        () => new RankingEntryMongoRepository(di.get(MongoConector))
    );

    di.bindLazySingleton(
        GetRankingsUseCase,
        () => new GetRankingsUseCase(di.get<RankingRepository>(rankingDIKeys.rankingRepository))
    );

    di.bindLazySingleton(
        GetRankingEntriesUseCase,
        () =>
            new GetRankingEntriesUseCase(
                di.get<RankingEntryRepository>(rankingDIKeys.rankingEntryRepository)
            )
    );

    di.bindFactory(
        RankingController,
        () => new RankingController(di.get(appDIKeys.jwtAuthenticator), di.get(GetRankingsUseCase))
    );

    di.bindFactory(
        RankingEntryController,
        () =>
            new RankingEntryController(
                di.get(appDIKeys.jwtAuthenticator),
                di.get(GetRankingEntriesUseCase)
            )
    );
}
