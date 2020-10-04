import React from "react";
import { Switch, Redirect, Route, HashRouter } from "react-router-dom";
import LoginPage from "../user/presentation/LoginPage";
import DashboardPage from "../dashboard/presentation/DashboardPage";
import CompetitorsPage from "../competitors/presentation/CompetitorsPage";
import VideosPage from "../videos/presentation/VideosPage";
import NewsFeedDetailPage from "../news/presentation/news-feed-detail/NewsFeedDetailPage";
import SendPushNotificationPage from "../notifications/presentation/SendPushNotificationPage";
import NotFoundPage from "../common/presentation/pages/NotFoundPage";
import PrivateRoute from "../common/presentation/components/private-route/PrivateRoute";
import NewsFeedListPage from "../news/presentation/news-feed-list/NewsFeedListPage";

export const pages = {
    base: { title: "base", path: "/admin" },
    login: { title: "Login", path: "/login" },
    dashboard: { title: "Dasboard", path: "/dashboard" },
    competitors: { title: "Competitors", path: "/competitors" },
    videos: { title: "Videos", path: "/videos" },
    newsFeedList: { title: "News Feeds", path: "/rss-feeds" },
    newsFeedDetail: { title: "Create News Feed", path: "/news-feed-detail" },
    sendPushNotification: { title: "Send push notification", path: "/send-push-notification" },
    notFound: { title: "Not found", path: "/not-found" },
};

export const AppRoutes: React.FC = () => {
    return (
        <HashRouter>
            <Switch>
                <Redirect exact from="/" to={pages.dashboard.path} />

                <Route path={pages.login.path} component={LoginPage} />
                <PrivateRoute path={pages.dashboard.path} component={DashboardPage} />
                <PrivateRoute path={pages.competitors.path} component={CompetitorsPage} />
                <PrivateRoute path={pages.videos.path} component={VideosPage} />
                <PrivateRoute path={pages.newsFeedList.path} component={NewsFeedListPage} />
                <PrivateRoute path={pages.newsFeedDetail.path} component={NewsFeedDetailPage} />
                <PrivateRoute
                    path={pages.sendPushNotification.path}
                    component={SendPushNotificationPage}
                />
                <Route path={pages.notFound.path} component={NotFoundPage} />

                <Redirect to={pages.notFound.path} />
            </Switch>
        </HashRouter>
    );
};
