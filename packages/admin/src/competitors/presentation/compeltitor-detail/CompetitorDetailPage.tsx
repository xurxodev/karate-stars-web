import React from "react";
import DetailPage from "../../../common/presentation/components/detail-page/DetailPage";
import { di } from "../../../CompositionRoot";
import CompetitorDetailBloc from "./CompetitorDetailBloc";

const CompetitorDetailPage: React.FC = () => {
    const bloc = di.get(CompetitorDetailBloc);

    return <DetailPage bloc={bloc} />;
};

export default CompetitorDetailPage;
