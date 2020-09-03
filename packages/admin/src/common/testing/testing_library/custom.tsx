import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import * as CompositionRoot from "../../../CompositionRoot";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import { AppBlocContext } from "../../../app/AppContext";
import theme from "../../../app/theme";
import { HashRouter } from "react-router-dom";
import AppBloc from "../../../app/AppBloc";

// First init the compostion root to be enable to override dependencies in component test
CompositionRoot.init();

const TestApp: React.FC = ({ children }) => {
    const appBloc = CompositionRoot.di.get(AppBloc);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBlocContext.Provider value={appBloc}>
                <HashRouter>{children}</HashRouter>
            </AppBlocContext.Provider>
        </ThemeProvider>
    );
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, "queries">) =>
    render(ui, { wrapper: TestApp, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
