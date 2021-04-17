import { Either, CompetitorData, Competitor, Id, ValidationTypes } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createResource, CreateResourceError } from "../../../common/domain/CreateResource";
import CategoryRepository from "../../../categories/domain/boundaries/CategoryRepository";
import CountryRepository from "../../../countries/domain/boundaries/CountryRepository";
import EventRepository from "../../../events/domain/boundaries/EventRepository";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CompetitorRepository from "../boundaries/CompetitorRepository";
import { validateCompetitorDependencies } from "./utils";

export interface CreateResourceArgs extends AdminUseCaseArgs {
    data: CompetitorData;
}

export class CreateCompetitorUseCase extends AdminUseCase<
    CreateResourceArgs,
    CreateResourceError<ValidationTypes>,
    ActionResult
> {
    constructor(
        private competitorRepository: CompetitorRepository,
        private categoryRepository: CategoryRepository,
        private countryRepository: CountryRepository,
        private eventRepository: EventRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({
        data,
    }: CreateResourceArgs): Promise<Either<CreateResourceError<ValidationTypes>, ActionResult>> {
        const createEntity = (data: CompetitorData) => Competitor.create(data);
        const getById = (id: Id) => this.competitorRepository.getById(id);
        const saveEntity = (entity: Competitor) => this.competitorRepository.save(entity);

        const validateDependencies = async (entity: Competitor) => {
            return validateCompetitorDependencies(
                entity,
                this.categoryRepository,
                this.countryRepository,
                this.eventRepository
            );
        };

        return createResource(data, createEntity, getById, saveEntity, validateDependencies);
    }
}
