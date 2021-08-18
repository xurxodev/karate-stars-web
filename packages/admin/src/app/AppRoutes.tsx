import React from "react";
import { Switch, Redirect, Route, HashRouter } from "react-router-dom";
import LoginPage from "../user/presentation/LoginPage";
import DashboardPage from "../dashboard/presentation/DashboardPage";
import NewsFeedDetailPage from "../news/presentation/news-feed-detail/NewsFeedDetailPage";
import SendPushNotificationPage from "../notifications/presentation/SendPushNotificationPage";
import NotFoundPage from "../common/presentation/pages/NotFoundPage";
import PrivateRoute from "../common/presentation/components/private-route/PrivateRoute";
import NewsFeedListPage from "../news/presentation/news-feed-list/NewsFeedListPage";
import { pages } from "../common/presentation/PageRoutes";
import CompetitorListPage from "../competitors/presentation/compeltitor-list/CompetitorListPage";
import CompetitorDetailPage from "../competitors/presentation/compeltitor-detail/CompetitorDetailPage";
import VideoListPage from "../videos/presentation/video-list/VideoListPage";
import VideoDetailPage from "../videos/presentation/video-detail/VideoDetailPage";
import EventDetailPage from "../events/presentation/event-detail/EventDetailPage";
import EventListPage from "../events/presentation/event-list/EventListPage";
import EventTypeDetailPage from "../event-types/presentation/event-type-detail/EventTypeDetailPage";
import EventTypeListPage from "../event-types/presentation/event-type-list/EventTypeListPage";
import CategoryTypeDetailPage from "../category-types/presentation/category-type-detail/CategoryTypeDetailPage";
import CategoryTypeListPage from "../category-types/presentation/category-type-list/CategoryTypeListPage";
import CategoryDetailPage from "../categories/presentation/category-detail/CategoryDetailPage";
import CategoryListPage from "../categories/presentation/category-list/CategoryListPage";
import CountryDetailPage from "../countries/presentation/country-detail/CountryDetailPage";
import CountryListPage from "../countries/presentation/country-list/CountryListPage";

export const AppRoutes: React.FC = () => {
    return (
        <HashRouter>
            <Switch>
                <Redirect exact from="/" to={pages.dashboard.path} />

                <Route path={pages.login.path} component={LoginPage} />
                <PrivateRoute path={pages.dashboard.path} component={DashboardPage} />
                <PrivateRoute path={pages.competitorDetail.path} component={CompetitorDetailPage} />
                <PrivateRoute path={pages.competitorList.path} component={CompetitorListPage} />

                <PrivateRoute path={pages.categoryDetail.path} component={CategoryDetailPage} />
                <PrivateRoute path={pages.categoryList.path} component={CategoryListPage} />

                <PrivateRoute
                    path={pages.categoryTypeDetail.path}
                    component={CategoryTypeDetailPage}
                />
                <PrivateRoute path={pages.categoryTypeList.path} component={CategoryTypeListPage} />

                <PrivateRoute path={pages.countryDetail.path} component={CountryDetailPage} />
                <PrivateRoute path={pages.countryList.path} component={CountryListPage} />

                <PrivateRoute path={pages.eventDetail.path} component={EventDetailPage} />
                <PrivateRoute path={pages.eventList.path} component={EventListPage} />

                <PrivateRoute path={pages.eventTypeDetail.path} component={EventTypeDetailPage} />
                <PrivateRoute path={pages.eventTypeList.path} component={EventTypeListPage} />

                <PrivateRoute path={pages.videoDetail.path} component={VideoDetailPage} />
                <PrivateRoute path={pages.videoList.path} component={VideoListPage} />

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
