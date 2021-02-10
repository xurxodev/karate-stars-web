import { Either } from "karate-stars-core";
import { Stream } from "stream";
import { UnexpectedError } from "../../common/api/Errors";

export type ImageType = "competitors" | "feeds" | "flags";

export interface ImageRepository {
    uploadNewImage(
        type: ImageType,
        filename: string,
        stream: Stream
    ): Promise<Either<UnexpectedError, string>>;

    deleteImage(type: ImageType, filename: string): Promise<Either<UnexpectedError, true>>;
}
