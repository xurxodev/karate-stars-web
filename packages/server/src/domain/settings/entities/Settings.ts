import { Id, Url } from "karate-stars-core";

export interface Settings {
    identifier: Id;
    socialNews: SettingsSocialNews;
    currentNews: SettingsCurrentNews;
}

export interface SettingsSocialNews {
    search: string;
}

export interface SettingsCurrentNews {
    feeds: NewsFeed[];
}

export interface NewsFeed {
    name: string;
    url: Url;
    language: string;
    type: string;
    image: Url;
}
