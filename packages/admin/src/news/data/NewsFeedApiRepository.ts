import { NewsFeedRepository } from "../domain/Boundaries";
import { NewsFeed, NewsFeedData } from "karate-stars-core";
import ApiRepository from "../../common/data/ApiRepository";
import { AxiosInstance } from "axios";
import { TokenStorage } from "../../common/data/TokenLocalStorage";

class NewsFeedApiRepository
    extends ApiRepository<NewsFeed, NewsFeedData>
    implements NewsFeedRepository
{
    constructor(axiosInstance: AxiosInstance, tokenStorage: TokenStorage) {
        super(axiosInstance, tokenStorage, "/news-feeds");
    }

    protected mapToDomain(data: NewsFeedData): NewsFeed {
        return NewsFeed.create(data).get();
    }
}

export default NewsFeedApiRepository;
