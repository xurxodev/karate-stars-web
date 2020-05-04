import React from "react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import Routes from "./Routes";
import "./App.css";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import theme from "./theme";

const App: React.FC = () => {
    const browserHistory = createBrowserHistory();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router history={browserHistory}>
                <Routes />
            </Router>
        </ThemeProvider>
    );
};

export default App;
