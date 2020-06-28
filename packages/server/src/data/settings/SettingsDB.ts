export interface SettingsDB {
    _id: string;
    socialNews: SettingsSocialNewsDB;
    currentNews: SettingsCurrentNewsDB;
}

export interface SettingsSocialNewsDB {
    search: string;
}

export interface SettingsCurrentNewsDB {
    feeds: NewsFeedDB[];
}

export interface NewsFeedDB {
    name: string;
    url: string;
    language: string;
    type: string;
    image: string;
}
