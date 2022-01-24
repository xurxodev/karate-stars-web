import NewsFeedRepository from "../../../newsfeeds/domain/boundaries/NewsFeedRepository";
import { CurrentNewsRepository } from "../boundaries/CurrentNewsRepository";
import { CurrentNews } from "../entities/CurrentNews";

export default class GetCurrentNewsUseCase {
    constructor(
        private currentNewsRepository: CurrentNewsRepository,
        private newsFeedRepository: NewsFeedRepository
    ) {}

    public async execute(): Promise<CurrentNews[]> {
        const newsFeeds = await this.newsFeedRepository.getAll();

        return this.currentNewsRepository.get(newsFeeds);
    }
}
