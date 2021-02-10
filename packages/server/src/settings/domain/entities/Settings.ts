import { Id } from "karate-stars-core";

export interface Settings {
    identifier: Id;
    socialNews: SettingsSocialNews;
}

export interface SettingsSocialNews {
    search: string;
}
