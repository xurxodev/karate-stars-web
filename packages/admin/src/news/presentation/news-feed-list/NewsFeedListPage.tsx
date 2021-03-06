import { NewsFeedRawData } from "karate-stars-core";
import React from "react";
import { BlocBuilder } from "../../../common/presentation/bloc";
import MainLayout from "../../../common/presentation/layouts/main/MainLayout";
import { di } from "../../../CompositionRoot";
import TableBuilder from "../../../common/presentation/components/table-builder/TableBuilder";
import NewsFeedListBloc from "./NewsFeedListBloc";
import { ListState, SortDirection } from "../../../common/presentation/state/ListState";

const NewsFeedListPage: React.FC = () => {
    const bloc = di.get(NewsFeedListBloc);

    const handleSearch = (search: string) => bloc.search(search);

    const handleOnSelectionChange = (id: string) => bloc.selectChange(id);

    const handleOnSelectionAllChange = (value: boolean) => bloc.selectAllChange(value);

    const handleOnPaginationChange = (page: number, pageSize: number) =>
        bloc.paginationChange(page, pageSize);

    const handleOnSortingChange = (field: keyof NewsFeedRawData, order: SortDirection) =>
        bloc.sortingChange(field, order);

    const onActionClick = () => {
        bloc.actionClick();
    };

    const handleItemActionClick = (actionName: string, id: string) =>
        bloc.actionItemClick(actionName, id);

    const handleonConfirmDelete = () => bloc.confirmDelete();

    const handleonCancelDelete = () => bloc.cancelDelete();

    return (
        <MainLayout title={"News Feed List"}>
            <BlocBuilder
                bloc={bloc}
                builder={(state: ListState<NewsFeedRawData>) => {
                    return (
                        <React.Fragment>
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
                        </React.Fragment>
                    );
                }}
            />
        </MainLayout>
    );
};

export default NewsFeedListPage;
