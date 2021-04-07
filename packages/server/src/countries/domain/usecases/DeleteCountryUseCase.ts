import { Either, Country, CountryData, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { DeleteResourceUseCase } from "../../../common/domain/DeleteResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CountryRepository from "../boundaries/CountryRepository";

export class DeleteCountryUseCase extends DeleteResourceUseCase<CountryData, Country> {
    constructor(private CountryRepository: CountryRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected getEntityById(
        id: Id
    ): Promise<Either<UnexpectedError | ResourceNotFoundError, Country>> {
        return this.CountryRepository.getById(id);
    }

    protected deleteEntity(id: Id): Promise<Either<UnexpectedError, ActionResult>> {
        return this.CountryRepository.delete(id);
    }
}
