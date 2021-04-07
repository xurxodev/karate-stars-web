import { CountryData, Country } from "karate-stars-core";
import { GetResourcesUseCase } from "../../../common/domain/GetResourcesUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";

import CountrysRepository from "../boundaries/CountryRepository";

export class GetCountriesUseCase extends GetResourcesUseCase<CountryData, Country> {
    constructor(private CountryRepository: CountrysRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected getEntities(): Promise<Country[]> {
        return this.CountryRepository.getAll();
    }
}
