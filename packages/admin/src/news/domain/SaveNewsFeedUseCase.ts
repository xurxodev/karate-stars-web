import { NewsFeedRepository } from "./Boundaries";
import { Either, EitherAsync, NewsFeed } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class SaveNewsFeedUseCase {
    constructor(
        private newsFeedRepository: NewsFeedRepository,
        private base64ImageToFile: (base64Image: string, name: string) => File
    ) {}

    async execute(newsFeed: NewsFeed): Promise<Either<DataError, true>> {
        debugger;
        if (newsFeed.image && newsFeed.image.isDataUrl) {
            return EitherAsync.fromPromise(this.newsFeedRepository.save(newsFeed))
                .flatMap(async () => {
                    debugger;
                    const file = this.base64ImageToFile(newsFeed.image.value, newsFeed.name);

                    const imageResult = this.newsFeedRepository.saveImage(newsFeed.id, file);

                    debugger;

                    return imageResult;
                })
                .run();
        } else {
            return this.newsFeedRepository.save(newsFeed);
        }
    }
}
