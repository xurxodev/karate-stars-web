import { Either, CountryData, Country, Id, EitherAsync } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { updateImageResource } from "../../../common/domain/UpdateImageResource";
import { UpdateResourceError } from "../../../common/domain/UpdateResource";
import { ImageRepository } from "../../../images/domain/ImageRepository";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CountryRepository from "../boundaries/CountryRepository";
import stream from "stream";

export interface CreateNewsFeedArg extends AdminUseCaseArgs {
    id: string;
    filename: string;
    image: stream.Readable;
}
export class UpdateCountryImageUseCase extends AdminUseCase<
    CreateNewsFeedArg,
    UpdateResourceError<CountryData>,
    ActionResult
> {
    constructor(
        private countryRepository: CountryRepository,
        private imageRepository: ImageRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({
        id,
        filename,
        image,
    }: CreateNewsFeedArg): Promise<Either<UpdateResourceError<CountryData>, ActionResult>> {
        const updateEntity = (entity: Country, imageUrl: string) =>
            entity.update({ ...entity.toData(), image: imageUrl });
        const getById = (id: Id) => this.countryRepository.getById(id);
        const saveEntity = (entity: Country) => this.countryRepository.save(entity);
        const uploadNewImage = () => this.imageRepository.uploadNewImage("flags", filename, image);

        return updateImageResource(
            id,
            getById,
            this.deletePreviousImage,
            uploadNewImage,
            updateEntity,
            saveEntity
        );
    }

    private deletePreviousImage(entity: Country): EitherAsync<UnexpectedError, true> {
        const filename = entity.image ? entity.image.value.split("/").pop() : undefined;

        if (filename) {
            return EitherAsync.fromPromise(this.imageRepository.deleteImage("feeds", filename));
        } else {
            return EitherAsync.fromEither(Either.right(true));
        }
    }
}
