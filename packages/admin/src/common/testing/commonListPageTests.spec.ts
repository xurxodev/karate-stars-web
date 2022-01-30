import "@testing-library/jest-dom/extend-expect";
import { EntityData } from "karate-stars-core";
import { Method } from "./mockServerTest";
import { render, tl } from "./testing_library/custom";
import * as mockServerTest from "../../common/testing/mockServerTest";
import { givenAValidAuthenticatedUser } from "./scenarios/UserTestScenarios";

interface DataListCreator<TData extends EntityData> {
    givenADataList: (count: number) => TData[];
}

export const commonListPageTests = <TData extends EntityData>(
    endpoint: string,
    verifiableFields: (keyof TData)[],
    dataCreator: DataListCreator<TData>,
    component: React.ReactElement
) => {
    const endpointToTest = `/api/v1/${endpoint}`;

    beforeEach(() => givenAValidAuthenticatedUser());

    describe(`${endpoint} list page`, () => {
        it("should does not render any rows", async () => {
            givenADataList(0);

            render(component);

            await tl.verifyTableIsEmptyAsync();
        });
        it("should render expected rows ", async () => {
            const items = givenADataList(13);

            render(component);

            await tl.verifyTableRowsAsync(items, verifiableFields);
        });
        it("should render expected error message ", async () => {
            givenAErrorServerResponse();

            render(component);

            await tl.verifyTextExistsAsync(
                "Sorry, an error has ocurred in the server. Please try later again"
            );
        });
        it("should render expected row after search", async () => {
            const items = givenADataList(15);

            render(component);

            const searchTerm = items[12][verifiableFields[0]] as unknown as string;

            await tl.searchAndVerifyAsync(searchTerm);
        });
    });

    function givenADataList(count: number): TData[] {
        const items = dataCreator.givenADataList(count);

        mockServerTest.addRequestHandlers([
            {
                method: "get",
                endpoint: endpointToTest,
                httpStatusCode: 200,
                response: items,
            },
        ]);

        return items;
    }

    function givenAErrorServerResponse(
        method: Method = "get",
        httpStatusCode = 500,
        endpoint = endpointToTest
    ) {
        mockServerTest.addRequestHandlers([
            {
                method,
                endpoint,
                httpStatusCode: httpStatusCode,
                response: {
                    statusCode: httpStatusCode,
                    error: "error",
                    message: "error message",
                },
            },
        ]);
    }
};

// just to avoid warning, that no tests in test file
describe("Common tests for CRUD routes", () => {
    test("should be used per implementation", () => {});
});
