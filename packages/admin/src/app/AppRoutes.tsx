import React from "react";
import { Switch, Redirect, Route, HashRouter } from "react-router-dom";
import LoginPage from "../user/presentation/LoginPage";
import DashboardPage from "../dashboard/presentation/DashboardPage";
import VideosPage from "../videos/presentation/VideosPage";
import NewsFeedDetailPage from "../news/presentation/news-feed-detail/NewsFeedDetailPage";
import SendPushNotificationPage from "../notifications/presentation/SendPushNotificationPage";
import NotFoundPage from "../common/presentation/pages/NotFoundPage";
import PrivateRoute from "../common/presentation/components/private-route/PrivateRoute";
import NewsFeedListPage from "../news/presentation/news-feed-list/NewsFeedListPage";
import { pages } from "../common/presentation/PageRoutes";
import CompetitorListPage from "../competitors/presentation/compeltitor-list/CompetitorListPage";
import CompetitorsDetailPage from "../competitors/presentation/compeltitor-detail/CompetitorsDetailPage";

export const AppRoutes: React.FC = () => {
    return (
        <HashRouter>
            <Switch>
                <Redirect exact from="/" to={pages.dashboard.path} />

                <Route path={pages.login.path} component={LoginPage} />
                <PrivateRoute path={pages.dashboard.path} component={DashboardPage} />
                <PrivateRoute
                    path={pages.competitorDetail.path}
                    component={CompetitorsDetailPage}
                />
                <PrivateRoute path={pages.competitorList.path} component={CompetitorListPage} />

                <PrivateRoute path={pages.videos.path} component={VideosPage} />
                <PrivateRoute path={pages.newsFeedDetail.path} component={NewsFeedDetailPage} />
                <PrivateRoute path={pages.newsFeedList.path} component={NewsFeedListPage} />
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
