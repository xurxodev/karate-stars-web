import CurrentNewsRepository from "../boundaries/CurrentNewsRepository";
import { CurrentNews } from "../entities/CurrentNews";
import SettingsRepository from "../../settings/boundaries/SettingsRepository";

export default class GetCurrentNewsUseCase {
    constructor(
        private currentNewsRepository: CurrentNewsRepository,
        private settingsRepository: SettingsRepository
    ) {}

    public async execute(): Promise<CurrentNews[]> {
        const settings = await this.settingsRepository.get();

        return this.currentNewsRepository.get(settings.currentNews.feeds);
    }
}
