import { MongoConector } from "../common/data/MongoConector";
import { appDIKeys, di } from "../CompositionRoot";
import UserRepository from "../users/domain/boundaries/UserRepository";
import { CountryController } from "./api/CountryController";
import CountryMongoRepository from "./data/CountryMongoRepository";
import CountryRepository from "./domain/boundaries/CountryRepository";
import { CreateCountryUseCase } from "./domain/usecases/CreateCountryUseCase";
import { DeleteCountryUseCase } from "./domain/usecases/DeleteCountryUseCase";
import { GetCountriesUseCase } from "./domain/usecases/GetCountriesUseCase";
import { GetCountryByIdUseCase } from "./domain/usecases/GetCountryByIdUseCase";
import { UpdateCountryUseCase } from "./domain/usecases/UpdateCountryUseCase";

export const countryDIKeys = {
    countryRepository: "countryRepository",
};

export function initializeCountries() {
    di.bindLazySingleton(
        countryDIKeys.countryRepository,
        () => new CountryMongoRepository(di.get(MongoConector))
    );

    di.bindLazySingleton(
        GetCountriesUseCase,
        () =>
            new GetCountriesUseCase(
                di.get<CountryRepository>(countryDIKeys.countryRepository),
                di.get<UserRepository>(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        GetCountryByIdUseCase,
        () =>
            new GetCountryByIdUseCase(
                di.get(countryDIKeys.countryRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        CreateCountryUseCase,
        () =>
            new CreateCountryUseCase(
                di.get(countryDIKeys.countryRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        UpdateCountryUseCase,
        () =>
            new UpdateCountryUseCase(
                di.get(countryDIKeys.countryRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        DeleteCountryUseCase,
        () =>
            new DeleteCountryUseCase(
                di.get(countryDIKeys.countryRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindFactory(
        CountryController,
        () =>
            new CountryController(
                di.get(appDIKeys.jwtAuthenticator),
                di.get(GetCountriesUseCase),
                di.get(GetCountryByIdUseCase),
                di.get(CreateCountryUseCase),
                di.get(UpdateCountryUseCase),
                di.get(DeleteCountryUseCase)
            )
    );
}
