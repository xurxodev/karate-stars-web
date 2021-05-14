export interface DetailPageParams {
    id?: string;
    action: "new" | "edit";
}

export interface BasicPageConfig {
    title: string;
    path: string;
}

export interface DetailPageConfig {
    title: string;
    path: string;
    generateUrl: (params: DetailPageParams) => string;
}

export type PageConfig = BasicPageConfig | DetailPageConfig;

export const pages: Record<string, PageConfig> = {
    login: { title: "Login", path: "/login" },
    dashboard: { title: "Dasboard", path: "/dashboard" },
    competitorList: { title: "Competitors", path: "/competitors" },
    competitorDetail: {
        title: "Create Competitor",
        path: "/competitors/:action(new|edit)/:id?",
        generateUrl: (params: DetailPageParams) =>
            `/competitors/${params.action}${params.id ? "/" + params.id : ""}`,
    },
    videos: { title: "Videos", path: "/videos" },
    newsFeedList: { title: "News Feeds", path: "/news-feeds" },
    newsFeedDetail: {
        title: "Create News Feed",
        path: "/news-feeds/:action(new|edit)/:id?",
        generateUrl: (params: DetailPageParams) =>
            `/news-feeds/${params.action}${params.id ? "/" + params.id : ""}`,
    },
    sendPushNotification: { title: "Send push notification", path: "/send-push-notification" },
    notFound: { title: "Not found", path: "/not-found" },
};
