import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import "./App.css";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import theme from "./theme";

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes />
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;
