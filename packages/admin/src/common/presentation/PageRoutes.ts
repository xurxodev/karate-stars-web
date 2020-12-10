export interface DetailPageParams {
    id?: string;
    action: "new" | "edit";
}

export const pages = {
    login: { title: "Login", path: "/login" },
    dashboard: { title: "Dasboard", path: "/dashboard" },
    competitors: { title: "Competitors", path: "/competitors" },
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
