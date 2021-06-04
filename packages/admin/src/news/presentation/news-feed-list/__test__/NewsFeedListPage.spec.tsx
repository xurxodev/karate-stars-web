import "@testing-library/jest-dom/extend-expect";

import {
    render,
    searchAndVerifyAsync,
    verifyTableIsEmptyAsync,
    verifyTableRowsAsync,
    verifyTextExistsAsync,
} from "../../../../common/testing/testing_library/custom";
import { givenAValidAuthenticatedUser } from "../../../../common/testing/scenarios/UserTestScenarios";
import NewsFeedListPage from "../NewsFeedListPage";
import * as mockServerTest from "../../../../common/testing/mockServerTest";
import { Method } from "../../../../common/testing/mockServerTest";
import { Id, NewsFeedData, RssType } from "karate-stars-core";

beforeEach(() => givenAValidAuthenticatedUser());

const endpointToTest = "/api/v1/news-feeds";
const verifiableFields: (keyof NewsFeedData)[] = ["name", "language", "type", "url"];

describe("News feed list page", () => {
    it("should does not render any rows", async () => {
        givenANewsFeeds(0);

        render(<NewsFeedListPage />);

        await verifyTableIsEmptyAsync();
    });
    it("should render expected rows ", async () => {
        const items = givenANewsFeeds(13);

        render(<NewsFeedListPage />);

        await verifyTableRowsAsync(items, verifiableFields);
    }, 10000);
    it("should render expected error message ", async () => {
        givenAErrorServerResponse();

        render(<NewsFeedListPage />);

        await verifyTextExistsAsync(
            "Sorry, an error has ocurred in the server. Please try later again"
        );
    });
    it("should render expected row after search", async () => {
        const items = givenANewsFeeds(15);

        render(<NewsFeedListPage />);

        const searchTerm = items[12][verifiableFields[0]] as string;

        await searchAndVerifyAsync(searchTerm);
    });
});

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

function givenANewsFeeds(count: number): NewsFeedData[] {
    const newsFeeds = Array.from(Array(count).keys()).map((_, index) => ({
        id: Id.generateId().value,
        name: `name ${("0" + index).slice(-2)}`,
        language: "en",
        type: "rss" as RssType,
        image: `https://storage.googleapis.com/karatestars-1261.appspot.com/feeds/${index}.png`,
        url: `http://fetchrss.com/rss/${index}.xml`,
    }));

    mockServerTest.addRequestHandlers([
        {
            method: "get",
            endpoint: endpointToTest,
            httpStatusCode: 200,
            response: newsFeeds,
        },
    ]);

    return newsFeeds;
}
