import { MongoConector } from "../common/data/MongoConector";
import { di } from "../CompositionRoot";
import { newsFeedDIKeys } from "../newsfeeds/NewsFeedsDIModule";
import CurrentNewsController from "./api/CurrentNewsController";
import CurrentNewsMongoRepository from "./data/CurrentNewsMongoRepository";
import GetCurrentNewsUseCase from "./domain/usecases/GetCurrentNewsUseCase";

export const currentNewsDIKeys = {
    currentNewsRepository: "currentNewsRepository",
};

export function initializeCurrentNews() {
    di.bindLazySingleton(
        currentNewsDIKeys.currentNewsRepository,
        () => new CurrentNewsMongoRepository(di.get(MongoConector))
    );

    di.bindLazySingleton(
        GetCurrentNewsUseCase,
        () =>
            new GetCurrentNewsUseCase(
                di.get(currentNewsDIKeys.currentNewsRepository),
                di.get(newsFeedDIKeys.newsFeedRepository)
            )
    );

    di.bindFactory(
        CurrentNewsController,
        () => new CurrentNewsController(di.get(GetCurrentNewsUseCase))
    );
}
