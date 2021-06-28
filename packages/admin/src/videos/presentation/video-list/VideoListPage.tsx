import React from "react";
import { di } from "../../../CompositionRoot";
import VideoListBloc from "./VideoListBloc";
import ListPage from "../../../common/presentation/components/list-page/ListPage";

const VideoListPage: React.FC = () => {
    const bloc = di.get(VideoListBloc);

    return <ListPage title={"Videos List"} bloc={bloc} />;
};

export default VideoListPage;
