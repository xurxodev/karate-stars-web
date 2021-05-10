import { Country, Either, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ConflictError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { deleteResource, DeleteResourceError } from "../../../common/domain/DeleteResource";
import CompetitorRepository from "../../../competitors/domain/boundaries/CompetitorRepository";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CountryRepository from "../boundaries/CountryRepository";

export interface DeleteResourceArgs extends AdminUseCaseArgs {
    id: string;
}

export class DeleteCountryUseCase extends AdminUseCase<
    DeleteResourceArgs,
    DeleteResourceError,
    ActionResult
> {
    constructor(
        private countryRepository: CountryRepository,
        private competitorRepository: CompetitorRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({ id }: DeleteResourceArgs): Promise<Either<DeleteResourceError, ActionResult>> {
        const getById = (id: Id) => this.countryRepository.getById(id);
        const deleteEntity = (id: Id) => this.countryRepository.delete(id);
        const validateAsForeingKey = async (
            entity: Country
        ): Promise<Either<ConflictError, Country>> => {
            const usedAsForeingKey = (await this.competitorRepository.getAll()).some(competitor =>
                competitor.countryId.equals(entity.id)
            );

            return usedAsForeingKey
                ? Either.left({
                      kind: "ConflictError",
                      message: `Delete error country ${entity.id.value} is used in some competitors`,
                  } as ConflictError)
                : Either.right(entity);
        };

        return deleteResource(id, getById, deleteEntity, validateAsForeingKey);
    }
}
