import { Either, CountryData } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";

import CountryRepository from "../boundaries/CountryRepository";

export class GetCountriesUseCase {
    constructor(private countryRepository: CountryRepository) {}

    public async execute(): Promise<Either<UnexpectedError, CountryData[]>> {
        const categories = await this.countryRepository.getAll();

        return Either.right(categories.map(entity => entity.toData()));
    }
}
