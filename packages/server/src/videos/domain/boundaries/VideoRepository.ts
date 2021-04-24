import { Either, Id, Video } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";

export default interface VideoRepository {
    getAll(): Promise<Video[]>;
    getById(id: Id): Promise<Either<ResourceNotFoundError | UnexpectedError, Video>>;
    delete(id: Id): Promise<Either<UnexpectedError, ActionResult>>;
    save(entity: Video): Promise<Either<UnexpectedError, ActionResult>>;
}
