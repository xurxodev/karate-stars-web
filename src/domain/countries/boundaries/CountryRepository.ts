import { Country } from "../entities/Country";

export default interface CountryRepository {
    get(): Promise<Country[]>;
}
