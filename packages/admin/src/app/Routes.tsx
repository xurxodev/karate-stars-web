import React from "react";
import { Switch, Redirect, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "../user/presentation/LoginPage";
import DashboardPage from "../dashboard/presentation/DashboardPage";
import CompetitorsPage from "../competitors/presentation/CompetitorsPage";
import VideosPage from "../videos/presentation/VideosPage";
import CurrentNewsSettingsPage from "../settings/current-news/presentation/CurrentNewsSettingsPage";
import SocialNewsSettingsPage from "../settings/social-news/presentation/SocialNewsSettingsPage";
import SendPushNotificationPage from "../notifications/presentation/SendPushNotificationPage";
import NotFoundPage from "../common/presentation/pages/NotFoundPage";

export const pages = {
    base: { title: "base", path: "/admin" },
    login: { title: "Login", path: "/login" },
    dashboard: { title: "Dasboard", path: "/dashboard" },
    competitors: { title: "Competitors", path: "/competitors" },
    videos: { title: "Videos", path: "/videos" },
    currentNewsSettings: { title: "Current news", path: "/current-news-settings" },
    socialNewsSettings: { title: "Social news", path: "/social-news-settings" },
    sendPushNotification: { title: "Send push notification", path: "/send-push-notification" },
    notFound: { title: "Not found", path: "/not-found" },
};

export const Routes: React.FC = () => {
    return (
        <BrowserRouter basename={pages.base.path}>
            <Switch>
                <Redirect exact from="/" to={pages.dashboard.path} />

                <Route path={pages.login.path} component={LoginPage} />
                <Route path={pages.dashboard.path} component={DashboardPage} />
                <Route path={pages.competitors.path} component={CompetitorsPage} />
                <Route path={pages.videos.path} component={VideosPage} />
                <Route path={pages.currentNewsSettings.path} component={CurrentNewsSettingsPage} />
                <Route path={pages.socialNewsSettings.path} component={SocialNewsSettingsPage} />
                <Route
                    path={pages.sendPushNotification.path}
                    component={SendPushNotificationPage}
                />
                <Route path={pages.notFound.path} component={NotFoundPage} />

                <Redirect to={pages.notFound.path} />
            </Switch>
        </BrowserRouter>
    );
};
