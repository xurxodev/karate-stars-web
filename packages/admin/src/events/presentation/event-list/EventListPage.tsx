import React from "react";
import { di } from "../../../CompositionRoot";
import EventListBloc from "./EventListBloc";
import ListPage from "../../../common/presentation/components/list-page/ListPage";

const EventListPage: React.FC = () => {
    const bloc = di.get(EventListBloc);

    return <ListPage title={"Event List"} bloc={bloc} />;
};

export default EventListPage;
