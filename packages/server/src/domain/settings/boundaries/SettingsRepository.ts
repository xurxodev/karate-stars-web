import { Settings } from "../entities/Settings";

export default interface SettingsRepository {
    get(): Promise<Settings>;
}
