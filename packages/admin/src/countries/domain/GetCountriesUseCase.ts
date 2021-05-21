import { CountryRepository } from "./Boundaries";
import { CountryData, Either } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class GetCountriesUseCase {
    constructor(private CountryRepository: CountryRepository) {}

    async execute(): Promise<Either<DataError, CountryData[]>> {
        const response = await this.CountryRepository.getAll();

        return response.map(items => items.map(item => item.toData()));
    }
}
