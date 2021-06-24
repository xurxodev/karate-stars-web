import React from "react";
import DetailPage from "../../../common/presentation/components/detail-page/DetailPage";
import { di } from "../../../CompositionRoot";
import EventDetailBloc from "./EventDetailBloc";

const EventDetailPage: React.FC = () => {
    const bloc = di.get(EventDetailBloc);

    return <DetailPage bloc={bloc} />;
};

export default EventDetailPage;
