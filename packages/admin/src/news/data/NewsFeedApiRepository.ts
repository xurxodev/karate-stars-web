import { NewsFeedRepository } from "../domain/Boundaries";
import { GetNewsFeedsError } from "../domain/Errors";
import { Either, NewsFeed, NewsFeedRawData } from "karate-stars-core";
import ApiRepository from "../../common/data/ApiRepository";

class NewsFeedApiRepository extends ApiRepository<NewsFeedRawData[]> implements NewsFeedRepository {
    async getAll(search?: string): Promise<Either<GetNewsFeedsError, NewsFeed[]>> {
        const apiResponse = await super.get(`/news-feeds`);

        const data = apiResponse.map(data =>
            data.filter(item => {
                return (
                    !search ||
                    Object.keys(item).some(field => (item as any)[field].includes(search))
                );
            })
        );

        return data.map(data => data.map(feed => NewsFeed.create(feed).get()));
    }
}

export default NewsFeedApiRepository;
