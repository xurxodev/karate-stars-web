import { Country } from "karate-stars-core";
import CountryRepository from "../boundaries/CountryRepository";

export default class GetCountriesUseCase {
    private repository: CountryRepository;

    constructor(resository: CountryRepository) {
        this.repository = resository;
    }

    public execute(): Promise<Country[]> {
        return this.repository.getAll();
    }
}
