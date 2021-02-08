import React from "react";
import { render, RenderOptions, screen, waitFor } from "@testing-library/react";
import * as CompositionRoot from "../../../CompositionRoot";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import { AppBlocContext } from "../../../app/AppContext";
import theme from "../../../app/theme";
import { HashRouter, Router } from "react-router-dom";
import AppBloc from "../../../app/AppBloc";
import userEvent from "@testing-library/user-event";
import * as H from "history";

// First init the compostion root to be enable to override dependencies in component test
CompositionRoot.init();

export interface TestAppProps {
    history?: H.History;
}

const TestApp: React.FC<TestAppProps> = ({ history, children }) => {
    const appBloc = CompositionRoot.di.get(AppBloc);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBlocContext.Provider value={appBloc}>
                {history ? (
                    <Router history={history}>{children}</Router>
                ) : (
                    <HashRouter>{children}</HashRouter>
                )}
            </AppBlocContext.Provider>
        </ThemeProvider>
    );
};

export interface CustomRenderOptions extends Omit<RenderOptions, "queries"> {
    history: H.History;
}

/* eslint-disable react/display-name */
const customRender = (ui: React.ReactElement, options?: CustomRenderOptions) =>
    render(ui, {
        wrapper: props => <TestApp {...props} history={options?.history ?? undefined} />,
        ...options,
    });

/* eslint-enable react/display-name */

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };

export function verifyTextExists(text: string) {
    expect(screen.getByText(text)).toBeInTheDocument();
}

export async function verifyTextExistsAsync(text: string) {
    await screen.findByText(text);
}

export function verifyTextNotExists(text: string) {
    expect(screen.queryByText(text)).not.toBeInTheDocument();
}

export function verifyValueInField(field: string, value: string) {
    const input = screen.getByLabelText(field) as HTMLInputElement;
    expect(input.value).toEqual(value);
}

export async function verifyValueInFieldAsync(field: string, value: string) {
    const input = screen.getByLabelText(field) as HTMLInputElement;

    await waitFor(() => expect(input.value).toEqual(value));
}

export function typeAndClear(field: string, text: string) {
    userEvent.type(screen.getByLabelText(field), text);
    userEvent.clear(screen.getByLabelText(field));
}

export function clear(field: string) {
    userEvent.clear(screen.getByLabelText(field));
}

export function type(field: string, text: string) {
    userEvent.type(screen.getByLabelText(field), text);
}

export function selectOption(field: string, text: string) {
    userEvent.selectOptions(screen.getByLabelText(field), text);
}

export function clickOnAccept() {
    userEvent.click(screen.getByRole("button", { name: "Accept" }));
}
