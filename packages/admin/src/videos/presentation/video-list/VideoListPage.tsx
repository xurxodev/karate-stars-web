import { VideoData } from "karate-stars-core";
import React from "react";
import { BlocBuilder } from "../../../common/presentation/bloc";
import MainLayout from "../../../common/presentation/layouts/main/MainLayout";
import { di } from "../../../CompositionRoot";
import TableBuilder from "../../../common/presentation/components/table-builder/TableBuilder";
import { ListState, SortDirection } from "../../../common/presentation/state/ListState";
import VideoListBloc from "./VideoListBloc";

const CompetitorListPage: React.FC = () => {
    const bloc = di.get(VideoListBloc);

    const handleSearch = (search: string) => bloc.search(search);

    const handleOnSelectionChange = (id: string) => bloc.selectChange(id);

    const handleOnSelectionAllChange = (value: boolean) => bloc.selectAllChange(value);

    const handleOnPaginationChange = (page: number, pageSize: number) =>
        bloc.paginationChange(page, pageSize);

    const handleOnSortingChange = (field: keyof VideoData, order: SortDirection) =>
        bloc.sortingChange(field, order);

    const onActionClick = () => {
        bloc.actionClick();
    };

    const handleItemActionClick = (actionName: string, id: string) =>
        bloc.actionItemClick(actionName, id);

    const handleonConfirmDelete = () => bloc.confirmDelete();

    const handleonCancelDelete = () => bloc.cancelDelete();

    return (
        <MainLayout title={"Videos List"}>
            <BlocBuilder
                bloc={bloc}
                builder={(state: ListState<VideoData>) => {
                    return (
                        <TableBuilder
                            state={state}
                            onSearchChange={handleSearch}
                            onSelectionChange={handleOnSelectionChange}
                            onSelectionAllChange={handleOnSelectionAllChange}
                            onPaginationChange={handleOnPaginationChange}
                            onSortingChange={handleOnSortingChange}
                            onItemActionClick={handleItemActionClick}
                            onActionClick={onActionClick}
                            onConfirmDelete={handleonConfirmDelete}
                            onCancelDelete={handleonCancelDelete}
                        />
                    );
                }}
            />
        </MainLayout>
    );
};

export default CompetitorListPage;
