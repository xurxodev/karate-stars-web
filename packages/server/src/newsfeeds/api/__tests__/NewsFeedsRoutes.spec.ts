import { Id, NewsFeed, NewsFeedData } from "karate-stars-core";
import { commonCRUDTests } from "../../../common/api/testUtils/crud.spec";
import { ServerDataCreator, TestDataCreator } from "../../../common/api/testUtils/DataCreator";
import { newsFeedDIKeys } from "../../NewsFeedsDIModule";

const entities = [
    NewsFeed.create({
        id: Id.generateId().value,
        name: "WKF News Center",
        url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567777611407.xml",
        language: "en",
        type: "rss",
        image: "https://firebasestorage.googleapis.com/v0/b/karatestars-1261.appspot.com/o/feeds%2Fwkf.png?alt=media",
    }).get(),
    NewsFeed.create({
        id: Id.generateId().value,
        name: "Inside The Games",
        url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567627850382.xml",
        language: "en",
        type: "rss",
        image: "https://firebasestorage.googleapis.com/v0/b/karatestars-1261.appspot.com/o/feeds%2Finside_the_games.gif?alt=media",
    }).get(),
];

const principalDataCreator: ServerDataCreator<NewsFeedData, NewsFeed> = {
    repositoryKey: newsFeedDIKeys.newsFeedRepository,
    items: () => {
        return entities;
    },
};

const testDataCreator: TestDataCreator<NewsFeedData> = {
    givenAValidNewItem: (): NewsFeedData => {
        return { ...entities[0].toData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: (): NewsFeedData => {
        return {
            ...entities[0].toData(),
            id: Id.generateId().value,
            url: "Invalid",
            image: "Invalid",
        };
    },
    givenAValidModifiedItem: (): NewsFeedData => {
        return { ...entities[0].toData(), name: entities[0].name + "modified" };
    },
    givenAInvalidModifiedItem: (): NewsFeedData => {
        return { ...entities[0].toData(), url: "Invalid" };
    },
    givenAItemToDelete: (): NewsFeedData => {
        return entities[0].toData();
    },
};

commonCRUDTests("news-feeds", testDataCreator, principalDataCreator);
