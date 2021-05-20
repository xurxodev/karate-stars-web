import React from "react";
import { di } from "../../../CompositionRoot";
import EventListBloc from "./EventTypeListBloc";
import ListPage from "../../../common/presentation/components/list-page/ListPage";

const EventListPage: React.FC = () => {
    const bloc = di.get(EventListBloc);

    return <ListPage title={"Event Type List"} bloc={bloc} />;
};

export default EventListPage;
