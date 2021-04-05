import { Id, NewsFeed, NewsFeedData } from "karate-stars-core";
import * as CompositionRoot from "../../../CompositionRoot";
import { commonCRUDTests, DataCreator } from "../../../common/api/testUtils/crud.spec";

const newsFeeds = [
    NewsFeed.create({
        id: Id.generateId().value,
        name: "WKF News Center",
        url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567777611407.xml",
        language: "en",
        type: "rss",
        image:
            "https://firebasestorage.googleapis.com/v0/b/karatestars-1261.appspot.com/o/feeds%2Fwkf.png?alt=media",
    }).get(),
    NewsFeed.create({
        id: Id.generateId().value,
        name: "Inside The Games",
        url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567627850382.xml",
        language: "en",
        type: "rss",
        image:
            "https://firebasestorage.googleapis.com/v0/b/karatestars-1261.appspot.com/o/feeds%2Finside_the_games.gif?alt=media",
    }).get(),
];

const newsFeedCreator: DataCreator<NewsFeedData, NewsFeed> = {
    givenAInitialItems: (): NewsFeed[] => {
        return newsFeeds;
    },
    givenAValidNewItem: (): NewsFeedData => {
        return { ...newsFeeds[0].toData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: (): NewsFeedData => {
        return {
            ...newsFeeds[0].toData(),
            id: Id.generateId().value,
            url: "Invalid",
            image: "Invalid",
        };
    },
    givenAValidModifiedItem: (): NewsFeedData => {
        return { ...newsFeeds[0].toData(), name: newsFeeds[0].name + "modified" };
    },
    givenAInvalidModifiedItem: (): NewsFeedData => {
        return { ...newsFeeds[0].toData(), url: "Invalid" };
    },
};

commonCRUDTests("news-feeds", CompositionRoot.names.newsFeedRepository, newsFeedCreator);
