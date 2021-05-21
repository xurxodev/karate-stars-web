import { di, appDIKeys } from "../CompositionRoot";
import CountryApiRepository from "./data/CountryApiRepository";
import { CountryRepository } from "./domain/Boundaries";
import DeleteCountryUseCase from "./domain/DeleteCountryUseCase";
import GetCountryByIdUseCase from "./domain/GetCountryByIdUseCase";
import GetCountrysUseCase from "./domain/GetCountriesUseCase";
import SaveCountryUseCase from "./domain/SaveCountryUseCase";
import CountryListBloc from "./presentation/country-list/CountryListBloc";

export const CountryDIKeys = {
    CountryRepository: "CountryRepository",
};

export function initCountries() {
    di.bindLazySingleton(
        CountryDIKeys.CountryRepository,
        () =>
            new CountryApiRepository(
                di.get(appDIKeys.axiosInstanceAPI),
                di.get(appDIKeys.tokenStorage)
            )
    );

    di.bindLazySingleton(
        GetCountrysUseCase,
        () => new GetCountrysUseCase(di.get<CountryRepository>(CountryDIKeys.CountryRepository))
    );

    di.bindLazySingleton(
        GetCountryByIdUseCase,
        () => new GetCountryByIdUseCase(di.get<CountryRepository>(CountryDIKeys.CountryRepository))
    );

    di.bindLazySingleton(
        SaveCountryUseCase,
        () => new SaveCountryUseCase(di.get<CountryRepository>(CountryDIKeys.CountryRepository))
    );

    di.bindLazySingleton(
        DeleteCountryUseCase,
        () => new DeleteCountryUseCase(di.get<CountryRepository>(CountryDIKeys.CountryRepository))
    );

    di.bindFactory(
        CountryListBloc,
        () => new CountryListBloc(di.get(GetCountrysUseCase), di.get(DeleteCountryUseCase))
    );

    // di.bindFactory(
    //     NewsFeedDetailBloc,
    //     () => new NewsFeedDetailBloc(di.get(GetNewsFeedByIdUseCase), di.get(SaveNewsFeedUseCase))
    // );
}
