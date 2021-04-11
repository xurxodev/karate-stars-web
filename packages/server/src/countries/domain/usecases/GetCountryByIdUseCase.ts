import { Either, CountryData } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CountryRepository from "../boundaries/CountryRepository";

export interface GetCountryByIdArg extends AdminUseCaseArgs {
    id: string;
}

type GetCountryByIdError = ResourceNotFoundError | UnexpectedError;

export class GetCountryByIdUseCase extends AdminUseCase<
    GetCountryByIdArg,
    GetCountryByIdError,
    CountryData
> {
    constructor(private countryRepository: CountryRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run({ id }: GetCountryByIdArg): Promise<Either<GetCountryByIdError, CountryData>> {
        const result = await createIdOrResourceNotFound<GetCountryByIdError>(id)
            .flatMap(id => this.countryRepository.getById(id))
            .map(entity => entity.toData())
            .run();

        return result;
    }
}
