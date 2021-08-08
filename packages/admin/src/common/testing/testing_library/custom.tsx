import React from "react";
import { render, RenderOptions, screen, waitFor, within } from "@testing-library/react";
import * as CompositionRoot from "../../../CompositionRoot";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import { AppBlocContext } from "../../../app/AppContext";
import theme from "../../../app/theme";
import { HashRouter, Route, Router } from "react-router-dom";
import AppBloc from "../../../app/AppBloc";
import userEvent from "@testing-library/user-event";
import * as H from "history";
import { arr } from "karate-stars-core";

// First init the compostion root to be enable to override dependencies in component test
CompositionRoot.init();

interface TestAppProps {
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

interface CustomRenderOptions extends Omit<RenderOptions, "queries"> {
    history: H.History;
}

/* eslint-disable react/display-name */
const customRender = (ui: React.ReactElement, options?: CustomRenderOptions) =>
    render(ui, {
        wrapper: props => <TestApp {...props} history={options?.history ?? undefined} />,
        ...options,
    });

const renderDetailPageToEdit = (endpoint: string, id: string, page: React.ReactElement) => {
    const history = H.createMemoryHistory();
    history.push(`${endpoint}/${id}`);

    customRender(<Route path={`/${endpoint}/:id`}>{page}</Route>, {
        history,
    });
};

function verifyTextExists(text: string) {
    expect(screen.getByText(text)).toBeInTheDocument();
}

async function verifyTextExistsAsync(text: string) {
    await screen.findByText(text);
}

async function verifyAlertAsync(text: string, exact?: boolean) {
    // await screen.findByRole("alert", { name: text, exact });
    await screen.findByText(text, { exact });
}

function verifyTextNotExists(text: string) {
    expect(screen.queryByText(text)).not.toBeInTheDocument();
}

function verifyValueInField(label: string | RegExp, value: string) {
    const input = screen.getByLabelText(label) as HTMLInputElement;
    expect(input.value).toEqual(value);
}

async function verifyTableIsEmptyAsync() {
    const rows = await screen.findAllByRole("row");
    expect(rows.length).toBe(1);
}

async function verifyTableRowsCountAsync(count: number) {
    const pageRows = await screen.findAllByRole("row");

    pageRows.shift();

    expect(pageRows.length).toBe(count);
}

async function verifyTableRowsAsync<T>(dataRows: T[], fields: Array<keyof T>, pageSize = 10) {
    const dataRowsPages = arr.chunk(dataRows, pageSize);

    for (const dataRowsPage of dataRowsPages) {
        const waitText = (dataRowsPage[0][fields[0]] as any).toString();
        //console.log({ waitText });
        await screen.findByText(waitText);

        const pageRows = await screen.findAllByRole("row");

        pageRows.shift();

        expect(pageRows.length).toBe(dataRowsPage.length);

        pageRows.forEach((row, index) => {
            const rowScope = within(row);
            const item = dataRowsPage[index];

            fields.forEach(field => {
                const text = item[field] as any;

                // if (field == "name") {
                //     console.log({ text });
                // }

                expect(rowScope.getByText(text)).toBeInTheDocument();
            });
        });

        const isLastPage = dataRowsPages.indexOf(dataRowsPage) === dataRowsPages.length - 1;

        if (!isLastPage) {
            //console.log("click on next");
            userEvent.click(screen.getByRole("button", { name: /next page/i }));
        }
    }
}

async function searchAndVerifyAsync(search: string) {
    await typeByPlaceholderTextAsync("Search ...", search);

    const table = await screen.findByRole("table");

    const tableScope = within(table);
    await tableScope.findByText(search);

    await verifyTableRowsCountAsync(1);
}

async function verifyValueInFieldAsync(label: string | RegExp, value: string) {
    const input = screen.getByLabelText(label) as HTMLInputElement;

    await waitFor(() => expect(input.value).toEqual(value));
}

function typeAndClear(label: string | RegExp, text: string) {
    userEvent.type(screen.getByLabelText(label), text);
    userEvent.clear(screen.getByLabelText(label));
}

function clear(label: string | RegExp) {
    userEvent.clear(screen.getByLabelText(label));
}

function typeByLabelText(label: string | RegExp, text: string) {
    userEvent.type(screen.getByLabelText(label), text);
}

async function typeByPlaceholderTextAsync(placeholder: string, text: string) {
    const element = await screen.findByPlaceholderText(placeholder);
    userEvent.type(element, text);
}

function selectOption(label: string | RegExp, text: string) {
    userEvent.selectOptions(screen.getByLabelText(label), text);
}

async function selectMultiOption(label: string | RegExp, text: string) {
    userEvent.click(screen.getByLabelText(label));
    const element = await screen.findByText(text);
    userEvent.click(element);
}

function clickOnAccept() {
    userEvent.click(screen.getByRole("button", { name: /accept/i }));
}

function clickOnOk() {
    userEvent.click(screen.getByRole("button", { name: /ok/i }));
}

function clickOnAdd() {
    userEvent.click(screen.getByRole("button", { name: /add/i }));
}

export const tl = {
    clear,
    clickOnAccept,
    clickOnOk,
    clickOnAdd,
    searchAndVerifyAsync,
    selectOption,
    verifyAlertAsync,
    verifyTableIsEmptyAsync,
    verifyTableRowsAsync,
    verifyTableRowsCountAsync,
    verifyTextNotExists,
    verifyTextExists,
    verifyTextExistsAsync,
    verifyValueInField,
    verifyValueInFieldAsync,
    typeAndClear,
    typeByLabelText,
    typeByPlaceholderTextAsync,
    selectMultiOption,
};

/* eslint-enable react/display-name */

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render, renderDetailPageToEdit };
