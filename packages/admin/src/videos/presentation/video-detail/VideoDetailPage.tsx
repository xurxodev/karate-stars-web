import React from "react";
import DetailPage from "../../../common/presentation/components/detail-page/DetailPage";
import { di } from "../../../CompositionRoot";
import VideoDetailBloc from "./VideoDetailBloc";

const VideoDetailPage: React.FC = () => {
    const bloc = di.get(VideoDetailBloc);

    return <DetailPage bloc={bloc} />;
};

export default VideoDetailPage;
