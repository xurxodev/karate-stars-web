import { NewsFeedRepository } from "../domain/Boundaries";
import { Either, Id, NewsFeed, NewsFeedRawData } from "karate-stars-core";
import ApiRepository from "../../common/data/ApiRepository";
import { DataError, ItemDataError } from "../../common/domain/Errors";

class NewsFeedApiRepository extends ApiRepository<NewsFeedRawData> implements NewsFeedRepository {
    endpoint = `/news-feeds`;

    async getAll(search?: string): Promise<Either<DataError, NewsFeed[]>> {
        const apiResponse = await super.getMany(this.endpoint);

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

    async getById(id: Id): Promise<Either<ItemDataError, NewsFeed>> {
        const data = await super.getOne(`${this.endpoint}/${id.value}`);

        return data.map(feed => NewsFeed.create(feed).get());
    }

    async deleteById(id: Id): Promise<Either<ItemDataError, true>> {
        return super.delete(`${this.endpoint}/${id.value}`);
    }

    async save(newsFeed: NewsFeed): Promise<Either<DataError, true>> {
        const feedResult = await super.getOne(`${this.endpoint}/${newsFeed.id.value}`);

        return feedResult.fold<Promise<Either<DataError, true>>>(
            async error => {
                if (error.kind === "ApiError" && error.statusCode === 404) {
                    return await super.post(
                        `${this.endpoint}/${newsFeed.id.value}`,
                        newsFeed.toRawData()
                    );
                } else {
                    return Either.left(error as DataError);
                }
            },
            async _ =>
                await super.put(`${this.endpoint}/${newsFeed.id.value}`, newsFeed.toRawData())
        );
    }
}

export default NewsFeedApiRepository;
