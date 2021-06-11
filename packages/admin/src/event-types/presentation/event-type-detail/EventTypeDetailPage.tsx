import React from "react";
import DetailPage from "../../../common/presentation/components/detail-page/DetailPage";
import { di } from "../../../CompositionRoot";
import EventTypeDetailBloc from "./EventTypeDetailBloc";

const EventTypeDetailPage: React.FC = () => {
    const bloc = di.get(EventTypeDetailBloc);

    return <DetailPage bloc={bloc} />;
};

export default EventTypeDetailPage;
