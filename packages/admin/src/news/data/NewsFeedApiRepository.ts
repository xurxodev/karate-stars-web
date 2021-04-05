import { NewsFeedRepository } from "../domain/Boundaries";
import { Either, Id, NewsFeed, NewsFeedData } from "karate-stars-core";
import ApiRepository from "../../common/data/ApiRepository";
import { DataError } from "../../common/domain/Errors";

class NewsFeedApiRepository extends ApiRepository<NewsFeedData> implements NewsFeedRepository {
    endpoint = `/news-feeds`;

    async getAll(): Promise<Either<DataError, NewsFeed[]>> {
        const apiResponse = await super.getMany(this.endpoint);

        return apiResponse.map(data => data.map(feed => NewsFeed.create(feed).get()));
    }

    async getById(id: Id): Promise<Either<DataError, NewsFeed>> {
        const data = await super.getOne(`${this.endpoint}/${id.value}`);

        return data.map(feed => NewsFeed.create(feed).get());
    }

    async deleteById(id: Id): Promise<Either<DataError, true>> {
        return super.delete(`${this.endpoint}/${id.value}`);
    }

    async save(newsFeed: NewsFeed): Promise<Either<DataError, true>> {
        return super.postOrPut(this.endpoint, newsFeed.id.value, newsFeed.toData());
    }

    async saveImage(newsFeedId: Id, file: File): Promise<Either<DataError, true>> {
        return super.putImage(this.endpoint, newsFeedId.value, file);
    }
}

export default NewsFeedApiRepository;
