import { Either, CountryData, Country, Id, ValidationError } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { CreateResourceUseCase } from "../../../common/domain/CreateResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CountryRepository from "../boundaries/CountryRepository";

export class CreateCountryUseCase extends CreateResourceUseCase<CountryData, Country> {
    constructor(private CountryRepository: CountryRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected createEntity(data: CountryData): Either<ValidationError<CountryData>[], Country> {
        return Country.create(data);
    }

    protected getEntityById(
        id: Id
    ): Promise<Either<UnexpectedError | ResourceNotFoundError, Country>> {
        return this.CountryRepository.getById(id);
    }

    protected saveEntity(entity: Country): Promise<Either<UnexpectedError, ActionResult>> {
        return this.CountryRepository.save(entity);
    }
}
