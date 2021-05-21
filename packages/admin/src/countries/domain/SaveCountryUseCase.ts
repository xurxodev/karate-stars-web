import { CountryRepository } from "./Boundaries";
import { Either, Country } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class SaveCountryUseCase {
    constructor(private CountryRepository: CountryRepository) {}

    async execute(entity: Country): Promise<Either<DataError, true>> {
        return this.CountryRepository.save(entity);
    }
}
