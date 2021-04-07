import { Either, Country, CountryData, Id, ValidationError } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { UpdateResourceUseCase } from "../../../common/domain/UpdateResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CountrysRepository from "../boundaries/CountryRepository";

export class UpdateCountryUseCase extends UpdateResourceUseCase<CountryData, Country> {
    constructor(private CountryRepository: CountrysRepository, userRepository: UserRepository) {
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

    protected updateEntity(
        data: CountryData,
        entity: Country
    ): Either<ValidationError<CountryData>[], Country> {
        return entity.update(data);
    }
}
