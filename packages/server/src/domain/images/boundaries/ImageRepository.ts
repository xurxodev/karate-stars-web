import { Either } from "karate-stars-core";
import { Stream } from "stream";
import { UnexpectedError } from "../../../api/common/Errors";

export type ImageType = "competitors" | "feeds" | "flags";

export interface ImageRepository {
    uploadNewImage(
        type: ImageType,
        fileName: string,
        stream: Stream
    ): Promise<Either<UnexpectedError, string>>;

    deleteImage(type: ImageType, fileName: string): Promise<Either<UnexpectedError, true>>;
}
