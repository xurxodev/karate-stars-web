import { Either, CountryData, Country, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { updateResource, UpdateResourceError } from "../../../common/domain/UpdateResource";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CountryRepository from "../boundaries/CountryRepository";

export interface UpdateResourceArgs extends AdminUseCaseArgs {
    id: string;
    data: CountryData;
}

export class UpdateCountryUseCase extends AdminUseCase<
    UpdateResourceArgs,
    UpdateResourceError<CountryData>,
    ActionResult
> {
    constructor(private countryRepository: CountryRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected run({
        id,
        data,
    }: UpdateResourceArgs): Promise<Either<UpdateResourceError<CountryData>, ActionResult>> {
        const updateEntity = (data: CountryData, entity: Country) => entity.update(data);
        ``;
        const getById = (id: Id) => this.countryRepository.getById(id);
        const saveEntity = (entity: Country) => this.countryRepository.save(entity);

        return updateResource(id, data, getById, updateEntity, saveEntity);
    }
}
