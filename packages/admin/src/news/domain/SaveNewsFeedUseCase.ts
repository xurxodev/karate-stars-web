import { NewsFeedRepository } from "./Boundaries";
import { Either, EitherAsync, NewsFeed } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class SaveNewsFeedUseCase {
    constructor(
        private newsFeedRepository: NewsFeedRepository,
        private base64ImageToFile: (base64Image: string, name: string) => File
    ) {}

    async execute(newsFeed: NewsFeed): Promise<Either<DataError, true>> {
        if (newsFeed.image !== undefined && newsFeed.image.isDataUrl) {
            const imageUrl = newsFeed.image.value;
            const newsFeedWithoutImage = NewsFeed.create({
                ...newsFeed.toRawData(),
                image: undefined,
            }).get();

            return EitherAsync.fromPromise(this.newsFeedRepository.save(newsFeedWithoutImage))
                .flatMap(async () => {
                    const file = this.base64ImageToFile(imageUrl, newsFeed.name);

                    const imageResult = this.newsFeedRepository.saveImage(newsFeed.id, file);

                    return imageResult;
                })
                .run();
        } else {
            return this.newsFeedRepository.save(newsFeed);
        }
    }
}
