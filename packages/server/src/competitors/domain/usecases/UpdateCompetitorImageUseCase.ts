import { Either, Id, EitherAsync, Competitor, ValidationTypes } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { updateImageResource } from "../../../common/domain/UpdateImageResource";
import { UpdateResourceError } from "../../../common/domain/UpdateResource";
import { ImageRepository } from "../../../images/domain/ImageRepository";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CompetitorRepository from "../boundaries/CompetitorRepository";
import stream from "stream";

export interface CreateCompetitorImageArg extends AdminUseCaseArgs {
    id: string;
    filename: string;
    image: stream.Readable;
}
export class UpdateCompetitorImageUseCase extends AdminUseCase<
    CreateCompetitorImageArg,
    UpdateResourceError<ValidationTypes>,
    ActionResult
> {
    constructor(
        private competitorRepository: CompetitorRepository,
        private imageRepository: ImageRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({
        id,
        filename,
        image,
    }: CreateCompetitorImageArg): Promise<
        Either<UpdateResourceError<ValidationTypes>, ActionResult>
    > {
        const updateEntity = (entity: Competitor, imageUrl: string) =>
            entity.update({ ...entity.toData(), mainImage: imageUrl });
        const getById = (id: Id) => this.competitorRepository.getById(id);
        const saveEntity = (entity: Competitor) => this.competitorRepository.save(entity);
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

    private deletePreviousImage(entity: Competitor): EitherAsync<UnexpectedError, true> {
        const filename = entity.mainImage ? entity.mainImage.value.split("/").pop() : undefined;

        if (filename) {
            return EitherAsync.fromPromise(this.imageRepository.deleteImage("feeds", filename));
        } else {
            return EitherAsync.fromEither(Either.right(true));
        }
    }
}
