import { CountryRepository } from "../domain/Boundaries";
import { CountryData, Country } from "karate-stars-core";
import ApiRepository from "../../common/data/ApiRepository";
import { AxiosInstance } from "axios";
import { TokenStorage } from "../../common/data/TokenLocalStorage";

class CountryApiRepository
    extends ApiRepository<Country, CountryData>
    implements CountryRepository {
    constructor(axiosInstance: AxiosInstance, tokenStorage: TokenStorage) {
        super(axiosInstance, tokenStorage, "countries");
    }

    protected mapToDomain(data: CountryData): Country {
        return Country.create(data).get();
    }
}

export default CountryApiRepository;
