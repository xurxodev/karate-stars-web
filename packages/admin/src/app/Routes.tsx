import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import MinimalLayout from "../common/layouts/minimal/MinimalLayout";
import LoginPage from "../user/presentation/LoginPage";

const Routes: React.FC = () => {
    return (
        <Switch>
            <Redirect exact from="/admin" to="/login" />
            <Route path="/login">
                <MinimalLayout>
                    <LoginPage />
                </MinimalLayout>
            </Route>

            <Redirect to="/not-found" />
        </Switch>
    );
};

export default Routes;
