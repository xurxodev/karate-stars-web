import { CountryRepository } from "./Boundaries";
import { Country, CountryData, Either } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";
import { createIdOrUnexpectedError } from "../../common/domain/utils";

export default class GetCountryByIdUseCase {
    constructor(private CountryRepository: CountryRepository) {}

    async execute(id: string): Promise<Either<DataError, CountryData>> {
        return await createIdOrUnexpectedError(id)
            .flatMap<Country>(id => this.CountryRepository.getById(id))
            .map(newsFeed => newsFeed.toData())
            .run();
    }
}
