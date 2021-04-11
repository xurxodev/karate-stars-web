import { Either, Id, NewsFeed, NewsFeedData } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import {
    ConflictError,
    ResourceNotFoundError,
    UnexpectedError,
    ValidationErrors,
} from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { updateResource } from "../../../common/domain/UpdateResource";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

export interface CreateNewsFeedArg extends AdminUseCaseArgs {
    id: string;
    data: NewsFeedData;
}

type UpdateNewsFeedError =
    | ConflictError
    | ResourceNotFoundError
    | UnexpectedError
    | ValidationErrors<NewsFeedData>;

export class UpdateNewsFeedUseCase extends AdminUseCase<
    CreateNewsFeedArg,
    UpdateNewsFeedError,
    ActionResult
> {
    constructor(private newsFeedsRepository: NewsFeedsRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run({
        id,
        data,
    }: CreateNewsFeedArg): Promise<Either<UpdateNewsFeedError, ActionResult>> {
        const updateEntity = (data: NewsFeedData, entity: NewsFeed) => entity.update(data);
        const getById = (id: Id) => this.newsFeedsRepository.getById(id);
        const saveEntity = (entity: NewsFeed) => this.newsFeedsRepository.save(entity);

        return updateResource(id, data, getById, updateEntity, saveEntity);
    }
}
