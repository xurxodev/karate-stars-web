import React from "react";
import { Switch, Redirect, Route, HashRouter } from "react-router-dom";
import LoginPage from "../user/presentation/LoginPage";
import DashboardPage from "../dashboard/presentation/DashboardPage";
import CompetitorsPage from "../competitors/presentation/CompetitorsPage";
import VideosPage from "../videos/presentation/VideosPage";
import CurrentNewsSettingsPage from "../settings/current-news/presentation/CurrentNewsSettingsPage";
import SocialNewsSettingsPage from "../settings/social-news/presentation/SocialNewsSettingsPage";
import SendPushNotificationPage from "../notifications/presentation/SendPushNotificationPage";
import NotFoundPage from "../common/presentation/pages/NotFoundPage";
import PrivateRoute from "../common/presentation/components/private-route/PrivateRoute";

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

export const AppRoutes: React.FC = () => {
    return (
        <HashRouter>
            <Switch>
                <Redirect exact from="/" to={pages.dashboard.path} />

                <Route path={pages.login.path} component={LoginPage} />
                <PrivateRoute path={pages.dashboard.path} component={DashboardPage} />
                <PrivateRoute path={pages.competitors.path} component={CompetitorsPage} />
                <PrivateRoute path={pages.videos.path} component={VideosPage} />
                <PrivateRoute
                    path={pages.currentNewsSettings.path}
                    component={CurrentNewsSettingsPage}
                />
                <PrivateRoute
                    path={pages.socialNewsSettings.path}
                    component={SocialNewsSettingsPage}
                />
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
