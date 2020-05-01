export interface Competitor {
    identifier: string;
    name: string;
    biography: string;
    countryId: string;
    categoryId: string;
    mainImage: string;
    isStar: boolean;
    isLegend: boolean;
    links: CompetitorLinks;
    achievements: Achievement[];
}

export interface CompetitorLinks {
    web: string;
    twitter: string;
    facebook: string;
    instagram: string;
}

export interface Achievement {
    name: string;
    details: AchievementDetail[];
}

export interface AchievementDetail {
    category: string;
    name: string;
    position: number;
}