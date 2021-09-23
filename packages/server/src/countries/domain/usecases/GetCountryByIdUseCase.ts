import { Either, CountryData } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import CountryRepository from "../boundaries/CountryRepository";

export interface GetCountryByIdArg {
    id: string;
}

type GetCountryByIdError = ResourceNotFoundError | UnexpectedError;

export class GetCountryByIdUseCase {
    constructor(private countryRepository: CountryRepository) {}

    public async execute({
        id,
    }: GetCountryByIdArg): Promise<Either<GetCountryByIdError, CountryData>> {
        const result = await createIdOrResourceNotFound<GetCountryByIdError>(id)
            .flatMap(id => this.countryRepository.getById(id))
            .map(entity => entity.toData())
            .run();

        return result;
    }
}
