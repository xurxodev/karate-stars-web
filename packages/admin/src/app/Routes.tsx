import React from "react";
import { Switch, Redirect, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "../user/presentation/LoginPage";
import DashboardPage from "../dashboard/presentation/DashboardPage";

export const paths = {
    base: "/admin",
    login: "/login",
    dashboard: "/dashboard",
    notFound: "/not-found",
};

export const Routes: React.FC = () => {
    return (
        <BrowserRouter basename={paths.base}>
            <Switch>
                <Redirect exact from="/" to={paths.login} />

                <Route path={paths.login}>
                    <LoginPage />
                </Route>

                <Route path={paths.dashboard}>
                    <DashboardPage />
                </Route>

                <Redirect to={paths.notFound} />
            </Switch>
        </BrowserRouter>
    );
};
