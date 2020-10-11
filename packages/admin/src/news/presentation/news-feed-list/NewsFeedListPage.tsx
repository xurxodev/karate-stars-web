import { NewsFeedRawData } from "karate-stars-core";
import React from "react";
import { BlocBuilder } from "../../../common/presentation/bloc";
import MainLayout from "../../../common/presentation/layouts/main/MainLayout";
import { di } from "../../../CompositionRoot";
import TableBuilder from "../../../common/presentation/components/table-builder/TableBuilder";
import NewsFeedListBloc from "./NewsFeedListBloc";
import { ListState } from "../../../common/presentation/state/ListState";

const NewsFeedListPage: React.FC = () => {
    const bloc = di.get(NewsFeedListBloc);

    return (
        <MainLayout title={"News Feed List"}>
            <BlocBuilder
                bloc={bloc}
                builder={(state: ListState<NewsFeedRawData>) => {
                    return <TableBuilder state={state} />;
                }}
            />
        </MainLayout>
    );
};

export default NewsFeedListPage;
