import { Event, EventData, Id } from "karate-stars-core";
import { commonCRUDTests, DataCreator } from "../../../common/api/testUtils/crud.spec";
import { eventDIKeys } from "../../EventDIModule";
import { EventsEndpoint } from "../EventRoutes";

const Events = [
    Event.create({
        id: "CYrgQdA0ZZm",
        name: "World Championships Maastricht 1984",
        year: 1984,
        typeId: "Jr6N73CZWtE",
    }).get(),
    Event.create({
        id: "QaFq0Lf2YDR",
        name: "European Championships Titograd 1989",
        year: 1989,
        typeId: "FEJ08kkHhqi",
    }).get(),
];

const EventCreator: DataCreator<EventData, Event> = {
    givenAInitialItems: () => {
        return Events;
    },
    givenAValidNewItem: () => {
        return { ...Events[0].toData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: () => {
        return {
            ...Events[0].toData(),
            id: Id.generateId().value,
            name: "",
        };
    },
    givenAValidModifiedItem: (): EventData => {
        return { ...Events[0].toData(), name: Events[0].name + "modified" };
    },
    givenAInvalidModifiedItem: (): EventData => {
        return { ...Events[0].toData(), name: "" };
    },
};

commonCRUDTests(EventsEndpoint, eventDIKeys.eventRepository, EventCreator);
