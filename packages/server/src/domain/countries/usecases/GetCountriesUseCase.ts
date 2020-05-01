import CountryRepository from "../boundaries/CountryRepository";
import { Country } from "../entities/Country";

export default class GetCountriesUseCase {
    private repository: CountryRepository;

    constructor(resository: CountryRepository) {
        this.repository = resository;
    }

    public execute(): Promise<Country[]> {
        return this.repository.get();
    }
}
