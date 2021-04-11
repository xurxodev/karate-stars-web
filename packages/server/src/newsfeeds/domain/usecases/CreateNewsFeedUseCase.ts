import { Either, Id, NewsFeed, NewsFeedData } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ConflictError, UnexpectedError, ValidationErrors } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createResource } from "../../../common/domain/CreateResource";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

export interface CreateNewsFeedArg extends AdminUseCaseArgs {
    data: NewsFeedData;
}

type CreateNewsFeedError = ValidationErrors<NewsFeedData> | UnexpectedError | ConflictError;

export class CreateNewsFeedUseCase extends AdminUseCase<
    CreateNewsFeedArg,
    CreateNewsFeedError,
    ActionResult
> {
    constructor(private newsFeedsRepository: NewsFeedsRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run({
        data,
    }: CreateNewsFeedArg): Promise<Either<CreateNewsFeedError, ActionResult>> {
        const createEntity = (data: NewsFeedData) => NewsFeed.create(data);
        const getById = (id: Id) => this.newsFeedsRepository.getById(id);
        const saveEntity = (entity: NewsFeed) => this.newsFeedsRepository.save(entity);

        return createResource(data, createEntity, getById, saveEntity);
    }
}
