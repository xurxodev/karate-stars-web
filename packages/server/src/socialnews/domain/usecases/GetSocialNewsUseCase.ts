import SettingsRepository from "../../../settings/domain/boundaries/SettingsRepository";
import SocialNewsRepository from "../boundaries/SocialNewsRepository";
import { SocialNews } from "../entities/SocialNews";

export default class GetSocialNewsUseCase {
    constructor(
        private socialNewsRepository: SocialNewsRepository
    ) {}

    public async execute(): Promise<SocialNews[]> {
        return this.socialNewsRepository.get();
    }
}
