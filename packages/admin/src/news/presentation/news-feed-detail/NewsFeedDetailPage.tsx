import React from "react";
import DetailPage from "../../../common/presentation/components/detail-page/DetailPage";
import { di } from "../../../CompositionRoot";
import NewsFeedDetailBloc from "./NewsFeedDetailBloc";

const NewsFeedDetailPage: React.FC = () => {
    const bloc = di.get(NewsFeedDetailBloc);

    return <DetailPage bloc={bloc} />;
};

export default NewsFeedDetailPage;
