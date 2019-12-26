export interface CurrentNews {
    summary: CurrentNewsSummary;
    source: NewsSource;
}

export interface CurrentNewsSummary {
    title: string;
    image: string | undefined;
    date: string;
    link: string;
}

export interface NewsSource {
    name: string;
    image: string;
    url: string;
}
