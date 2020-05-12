import React from "react";
import "./App.css";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import theme from "./theme";
import CompositionRoot from "../CompositionRoot";
import { AppRoutes } from "./AppRoutes";
import { AppBlocContext } from "./AppContext";

const appBloc = CompositionRoot.getInstance().provideAppBloc();

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBlocContext.Provider value={appBloc}>
                <AppRoutes />
            </AppBlocContext.Provider>
        </ThemeProvider>
    );
};

export default App;
