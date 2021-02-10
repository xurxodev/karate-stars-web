import SettingsRepository from "../../../settings/domain/boundaries/SettingsRepository";
import SocialNewsRepository from "../boundaries/SocialNewsRepository";
import { SocialNews } from "../entities/SocialNews";

export default class GetSocialNewsUseCase {
    constructor(
        private socialNewsRepository: SocialNewsRepository,
        private settingsRepository: SettingsRepository
    ) {}

    public async execute(): Promise<SocialNews[]> {
        const settings = await this.settingsRepository.get();

        return this.socialNewsRepository.get(settings.socialNews.search);
    }
}
