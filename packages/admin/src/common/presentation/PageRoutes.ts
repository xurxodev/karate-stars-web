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
    categoryList: { title: "Categories", path: "/categories" },
    categoryDetail: {
        title: "Create category",
        path: "/categories/:action(new|edit)/:id?",
        generateUrl: (params: DetailPageParams) =>
            `/categories/${params.action}${params.id ? "/" + params.id : ""}`,
    },
    categoryTypeList: { title: "Category Types", path: "/category-types" },
    categoryTypeDetail: {
        title: "Create category Type",
        path: "/category-types/:action(new|edit)/:id?",
        generateUrl: (params: DetailPageParams) =>
            `/category-types/${params.action}${params.id ? "/" + params.id : ""}`,
    },
    eventList: { title: "Events", path: "/events" },
    eventDetail: {
        title: "Create event",
        path: "/events/:action(new|edit)/:id?",
        generateUrl: (params: DetailPageParams) =>
            `/events/${params.action}${params.id ? "/" + params.id : ""}`,
    },
    eventTypeList: { title: "Event Types", path: "/event-types" },
    eventTypeDetail: {
        title: "Create event Type",
        path: "/event-types/:action(new|edit)/:id?",
        generateUrl: (params: DetailPageParams) =>
            `/event-types/${params.action}${params.id ? "/" + params.id : ""}`,
    },
    competitorList: { title: "Competitors", path: "/competitors" },
    competitorDetail: {
        title: "Create Competitor",
        path: "/competitors/:action(new|edit)/:id?",
        generateUrl: (params: DetailPageParams) =>
            `/competitors/${params.action}${params.id ? "/" + params.id : ""}`,
    },
    videoList: { title: "Videos", path: "/videos" },
    videoDetail: {
        title: "Create Video",
        path: "/videos/:action(new|edit)/:id?",
        generateUrl: (params: DetailPageParams) =>
            `/videos/${params.action}${params.id ? "/" + params.id : ""}`,
    },
    newsFeedList: { title: "News Feeds", path: "/news-feeds" },
    newsFeedDetail: {
        title: "Create News Feed",
        path: "/news-feeds/:action(new|edit)/:id?",
        generateUrl: (params: DetailPageParams) =>
            `/news-feeds/${params.action}${params.id ? "/" + params.id : ""}`,
    },
    sendPushNotification: { title: "Send news", path: "/send-push-notification" },
    notFound: { title: "Not found", path: "/not-found" },
};
