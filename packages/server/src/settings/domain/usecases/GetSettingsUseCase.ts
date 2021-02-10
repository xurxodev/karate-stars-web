import SettingsRepository from "../boundaries/SettingsRepository";
import { Settings } from "../entities/Settings";

export default class GetSettingsUseCase {
    constructor(private repository: SettingsRepository) {}

    public execute(): Promise<Settings> {
        return this.repository.get();
    }
}
