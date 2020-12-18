import { Either } from "karate-stars-core";
import { Stream } from "stream";
import { UnexpectedError } from "../../../api/common/Errors";

export type ImageType = "competitors" | "feeds" | "flags";

export interface ImageRepository {
    uploadNewFile(
        type: ImageType,
        fileName: string,
        stream: Stream
    ): Promise<Either<UnexpectedError, string>>;
}
