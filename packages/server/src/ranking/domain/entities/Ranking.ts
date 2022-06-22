export interface Ranking {
    id: string;
    name: string;
    webUrl: string | null;
    apiUrl: string | null;
    categoryParameter: string | null;
    categories: string[];
}
