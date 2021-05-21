import { CountryRepository } from "./Boundaries";
import { Either } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";
import { createIdOrUnexpectedError } from "../../common/domain/utils";

export default class DeleteCountryUseCase {
    constructor(private CountryRepository: CountryRepository) {}

    async execute(id: string): Promise<Either<DataError, true>> {
        const result = await createIdOrUnexpectedError(id)
            .flatMap(async id => this.CountryRepository.deleteById(id))
            .run();

        return result;
    }
}
