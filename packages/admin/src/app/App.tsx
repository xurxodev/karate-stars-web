import React from "react";
import Routes from "./Routes";
import "./App.css";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import theme from "./theme";

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes />
        </ThemeProvider>
    );
};

export default App;
