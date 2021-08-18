import React from "react";
import { di } from "../../../CompositionRoot";
import CompetitorListBloc from "./CompetitorListBloc";
import ListPage from "../../../common/presentation/components/list-page/ListPage";
import { withRouter } from "react-router-dom";

const CompetitorListPage: React.FC = () => {
    const bloc = di.get(CompetitorListBloc);

    return <ListPage title={"Competitor List"} bloc={bloc} />;
};

export default withRouter(CompetitorListPage);
