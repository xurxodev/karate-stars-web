import React from "react";
import { di } from "../../../CompositionRoot";
import NewsFeedListBloc from "./NewsFeedListBloc";
import ListPage from "../../../common/presentation/components/list-page/ListPage";

const NewsFeedListPage: React.FC = () => {
    const bloc = di.get(NewsFeedListBloc);

    return <ListPage title={"News Feed List"} bloc={bloc} />;
};

export default NewsFeedListPage;
