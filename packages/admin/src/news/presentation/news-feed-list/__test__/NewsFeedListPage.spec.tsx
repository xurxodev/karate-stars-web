import "@testing-library/jest-dom/extend-expect";

import { givenAValidAuthenticatedUser } from "../../../../common/testing/scenarios/UserTestScenarios";
import NewsFeedListPage from "../NewsFeedListPage";
import { Id, NewsFeedData, RssType } from "karate-stars-core";
import { commonListPageTests } from "../../../../common/testing/commonListPageTests.spec";

beforeEach(() => givenAValidAuthenticatedUser());

const verifiableFields: (keyof NewsFeedData)[] = ["name", "language", "type", "url"];

const dataListCreator = {
    givenADataList: (count: number): NewsFeedData[] => {
        const newsFeeds = Array.from(Array(count).keys()).map((_, index) => ({
            id: Id.generateId().value,
            name: `name ${("0" + index).slice(-2)}`,
            language: "en",
            type: "rss" as RssType,
            image: `https://storage.googleapis.com/karatestars-1261.appspot.com/feeds/${index}.png`,
            url: `http://fetchrss.com/rss/${index}.xml`,
        }));

        return newsFeeds;
    },
};

commonListPageTests("news-feeds", verifiableFields, dataListCreator, <NewsFeedListPage />);
