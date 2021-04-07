import { Either, CountryData, Country, Id } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { GetResourceByIdUseCase } from "../../../common/domain/GetResourceByIdUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CountrysRepository from "../boundaries/CountryRepository";

export class GetCountryByIdUseCase extends GetResourceByIdUseCase<CountryData, Country> {
    constructor(private CountryRepository: CountrysRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected getEntityById(
        id: Id
    ): Promise<Either<ResourceNotFoundError | UnexpectedError, Country>> {
        return this.CountryRepository.getById(id);
    }
}
