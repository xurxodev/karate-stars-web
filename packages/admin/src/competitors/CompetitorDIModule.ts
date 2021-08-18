import GetCategoriesUseCase from "../categories/domain/GetCategoriesUseCase";
import { base64ImageToFile } from "../common/data/Base64ImageConverter";
import { di, appDIKeys } from "../CompositionRoot";
import GetCountriesUseCase from "../countries/domain/GetCountriesUseCase";
import GetEventsUseCase from "../events/domain/GetEventsUseCase";
import CompetitorApiRepository from "./data/CompetitorApiRepository";
import { CompetitorRepository } from "./domain/Boundaries";
import DeleteCompetitorUseCase from "./domain/DeleteCompetitorUseCase";
import GetCompetitorByIdUseCase from "./domain/GetCompetitorByIdUseCase";
import GetCompetitorsUseCase from "./domain/GetCompetitorsUseCase";
import SaveCompetitorUseCase from "./domain/SaveCompetitorUseCase";
import CompetitorDetailBloc from "./presentation/compeltitor-detail/CompetitorDetailBloc";
import CompetitorListBloc from "./presentation/compeltitor-list/CompetitorListBloc";

export const competitorDIKeys = {
    competitorRepository: "competitorRepository",
};

export function initCompetitors() {
    di.bindLazySingleton(
        competitorDIKeys.competitorRepository,
        () =>
            new CompetitorApiRepository(
                di.get(appDIKeys.axiosInstanceAPI),
                di.get(appDIKeys.tokenStorage)
            )
    );

    di.bindLazySingleton(
        GetCompetitorsUseCase,
        () =>
            new GetCompetitorsUseCase(
                di.get<CompetitorRepository>(competitorDIKeys.competitorRepository)
            )
    );

    di.bindLazySingleton(
        GetCompetitorByIdUseCase,
        () =>
            new GetCompetitorByIdUseCase(
                di.get<CompetitorRepository>(competitorDIKeys.competitorRepository)
            )
    );

    di.bindLazySingleton(
        SaveCompetitorUseCase,
        () =>
            new SaveCompetitorUseCase(
                di.get<CompetitorRepository>(competitorDIKeys.competitorRepository),
                base64ImageToFile
            )
    );

    di.bindLazySingleton(
        DeleteCompetitorUseCase,
        () =>
            new DeleteCompetitorUseCase(
                di.get<CompetitorRepository>(competitorDIKeys.competitorRepository)
            )
    );

    di.bindFactory(
        CompetitorListBloc,
        () => new CompetitorListBloc(di.get(GetCompetitorsUseCase), di.get(DeleteCompetitorUseCase))
    );

    di.bindFactory(
        CompetitorDetailBloc,
        () =>
            new CompetitorDetailBloc(
                di.get(GetCompetitorByIdUseCase),
                di.get(SaveCompetitorUseCase),
                di.get(GetCountriesUseCase),
                di.get(GetCategoriesUseCase),
                di.get(GetEventsUseCase)
            )
    );
}
