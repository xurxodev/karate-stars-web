export interface SettingsDB {
    _id: string;
    socialNews: SettingsSocialNewsDB;
}

export interface SettingsSocialNewsDB {
    search: string;
}
