import React from "react";
import { Switch, Redirect, Route, HashRouter } from "react-router-dom";
import LoginPage from "../user/presentation/LoginPage";
import DashboardPage from "../dashboard/presentation/DashboardPage";
import CompetitorsPage from "../competitors/presentation/CompetitorsPage";
import VideosPage from "../videos/presentation/VideosPage";
import SettingsPage from "../settings/presentation/SettingsPage";
import SendPushNotificationPage from "../notifications/presentation/SendPushNotificationPage";
import NotFoundPage from "../common/presentation/pages/NotFoundPage";
import PrivateRoute from "../common/presentation/components/private-route/PrivateRoute";

export const pages = {
    base: { title: "base", path: "/admin" },
    login: { title: "Login", path: "/login" },
    dashboard: { title: "Dasboard", path: "/dashboard" },
    competitors: { title: "Competitors", path: "/competitors" },
    videos: { title: "Videos", path: "/videos" },
    settings: { title: "Settings", path: "/settings" },
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
                <PrivateRoute path={pages.settings.path} component={SettingsPage} />
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
