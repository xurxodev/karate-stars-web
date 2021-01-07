import { Either } from "karate-stars-core";
import { Stream } from "stream";
import { ImageRepository, ImageType } from "../../../domain/images/boundaries/ImageRepository";
import { UnexpectedError } from "../Errors";

export class FakeImageRepository implements ImageRepository {
    uploadNewImage(
        type: ImageType,
        filename: string,
        _stream: Stream
    ): Promise<Either<UnexpectedError, string>> {
        const refName = `${type}/${filename}`;
        return Promise.resolve(Either.right(`https://storage.googleapis.com/${refName}`));
    }

    deleteImage(_type: ImageType, _fileName: string): Promise<Either<UnexpectedError, true>> {
        return Promise.resolve(Either.right(true));
    }
}
