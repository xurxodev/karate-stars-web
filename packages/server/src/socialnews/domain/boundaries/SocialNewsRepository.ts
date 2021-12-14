import { Either } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { UnexpectedError } from "../../../common/api/Errors";
import { SocialNews } from "../entities/SocialNews";

export default interface SocialNewsRepository<> {
    get(): Promise<SocialNews[]>;
}

export interface SocialNewsWritableRepository<> {
    replaceAll(entities: SocialNews[]): Promise<Either<UnexpectedError, ActionResult>>;
}
