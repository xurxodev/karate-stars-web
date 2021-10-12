export interface SocialNews {
    summary: SocialNewsSummary;
    network: Network;
    user: SocialUser;
}

export interface SocialNewsSummary {
    title: string;
    image: string | undefined;
    video: string | undefined;
    date: string;
    link: string;
}

export interface SocialUser {
    name: string;
    image: string;
    url: string;
    userName: string;
}

export type Network = "twitter" | "instagram";
