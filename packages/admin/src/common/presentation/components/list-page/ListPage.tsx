import { EntityData } from "karate-stars-core";
import React from "react";
import { BlocBuilder } from "../../bloc";
import ListBloc from "../../bloc/ListBloc";
import MainLayout from "../../layouts/main/MainLayout";
import { ListState, SortDirection } from "../../state/ListState";
import TableBuilder from "../table-builder/TableBuilder";

interface ListPageProps<Data extends EntityData> {
    title: string;
    bloc: ListBloc<Data>;
}

export default function ListPage<Data extends EntityData>({ title, bloc }: ListPageProps<Data>) {
    const handleSearch = (search: string) => bloc.search(search);

    const handleOnSelectionChange = (id: string) => bloc.selectChange(id);

    const handleOnSelectionAllChange = (value: boolean) => bloc.selectAllChange(value);

    const handleOnPaginationChange = (page: number, pageSize: number) =>
        bloc.paginationChange(page, pageSize);

    const handleOnSortingChange = (field: keyof Data, order: SortDirection) =>
        bloc.sortingChange(field, order);

    const onActionClick = () => {
        bloc.actionClick();
    };

    const handleItemActionClick = (actionName: string, id: string) =>
        bloc.actionItemClick(actionName, id);

    const handleonConfirmDelete = () => bloc.confirmDelete();

    const handleonCancelDelete = () => bloc.cancelDelete();

    return (
        <MainLayout title={title}>
            <BlocBuilder
                bloc={bloc}
                builder={(state: ListState<Data>) => {
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
}
