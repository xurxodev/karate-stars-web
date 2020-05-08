import React from "react";
import { Switch, Redirect, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "../user/presentation/LoginPage";
import HomePage from "../home/presentation/HomePage";

const Routes: React.FC = () => {
    return (
        <BrowserRouter basename="/admin">
            <Switch>
                <Redirect exact from="/" to="/login" />

                <Route path="/login">
                    <LoginPage />
                </Route>

                <Route path="/home">
                    <HomePage />
                </Route>

                <Redirect to="/not-found" />
            </Switch>
        </BrowserRouter>
    );
};

export default Routes;
