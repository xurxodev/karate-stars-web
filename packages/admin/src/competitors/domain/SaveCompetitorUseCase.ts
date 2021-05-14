import { CompetitorRepository } from "./Boundaries";
import { Competitor, Either, EitherAsync } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class SaveCompetitorUseCase {
    constructor(
        private competitorRepository: CompetitorRepository,
        private base64ImageToFile: (base64Image: string, name: string) => File
    ) {}

    async execute(competitor: Competitor): Promise<Either<DataError, true>> {
        if (competitor.mainImage !== undefined && competitor.mainImage.isDataUrl) {
            const imageUrl = competitor.mainImage.value;
            const entityWithoutImage = Competitor.create({
                ...competitor.toData(),
                mainImage: undefined,
            }).get();

            return EitherAsync.fromPromise(this.competitorRepository.save(entityWithoutImage))
                .flatMap(async () => {
                    const file = this.base64ImageToFile(
                        imageUrl,
                        `${competitor.lastName}-${competitor.firstName}`
                    );

                    const imageResult = this.competitorRepository.saveImage(competitor.id, file);

                    return imageResult;
                })
                .run();
        } else {
            return this.competitorRepository.save(competitor);
        }
    }
}
