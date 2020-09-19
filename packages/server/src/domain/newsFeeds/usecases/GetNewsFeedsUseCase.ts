import { NewsFeedRawData } from "karate-stars-core";
import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

export default class GetNewsFeedsUseCase {
    constructor(private newsFeedsRepository: NewsFeedsRepository) {}

    public async execute(): Promise<NewsFeedRawData[]> {
        const newsFeed = await this.newsFeedsRepository.getAll();

        return newsFeed.map(newsFeed => newsFeed.toRawData());
    }
}
