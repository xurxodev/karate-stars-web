import { Either, CountryData, Country, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createResource, CreateResourceError } from "../../../common/domain/CreateResourceUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CountryRepository from "../boundaries/CountryRepository";

export interface CreateResourceArgs extends AdminUseCaseArgs {
    data: CountryData;
}

export class CreateCountryUseCase extends AdminUseCase<
    CreateResourceArgs,
    CreateResourceError<CountryData>,
    ActionResult
> {
    constructor(private countryRepository: CountryRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected run({
        data,
    }: CreateResourceArgs): Promise<Either<CreateResourceError<CountryData>, ActionResult>> {
        const createEntity = (data: CountryData) => Country.create(data);
        const getById = (id: Id) => this.countryRepository.getById(id);
        const saveEntity = (entity: Country) => this.countryRepository.save(entity);

        return createResource(data, createEntity, getById, saveEntity);
    }
}
