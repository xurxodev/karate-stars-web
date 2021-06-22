import { CountryRepository } from "./Boundaries";
import { Either, Country, EitherAsync } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class SaveCountryUseCase {
    constructor(
        private countryRepository: CountryRepository,
        private base64ImageToFile: (base64Image: string, name: string) => File
    ) {}

    async execute(entity: Country): Promise<Either<DataError, true>> {
        if (entity.image !== undefined && entity.image.isDataUrl) {
            const imageUrl = entity.image.value;
            const entityWithoutImage = Country.create({
                ...entity.toData(),
                image: undefined,
            }).get();

            return EitherAsync.fromPromise(this.countryRepository.save(entityWithoutImage))
                .flatMap(async () => {
                    const file = this.base64ImageToFile(imageUrl, entity.name);

                    const imageResult = this.countryRepository.saveImage(entity.id, file);

                    return imageResult;
                })
                .run();
        } else {
            return this.countryRepository.save(entity);
        }
    }
}
