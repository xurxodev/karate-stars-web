import { Either, CountryData } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";

import CountryRepository from "../boundaries/CountryRepository";

export class GetCountriesUseCase extends AdminUseCase<
    AdminUseCaseArgs,
    UnexpectedError,
    CountryData[]
> {
    constructor(private countryRepository: CountryRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run(_: AdminUseCaseArgs): Promise<Either<UnexpectedError, CountryData[]>> {
        const categories = await this.countryRepository.getAll();

        return Either.right(categories.map(entity => entity.toData()));
    }
}
