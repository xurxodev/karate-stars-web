import React from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { EntityData } from "karate-stars-core";
import { Redirect } from "react-router-dom";
import { BlocBuilder } from "../../bloc";
import ListBloc from "../../bloc/ListBloc";
import MainLayout from "../../layouts/main/MainLayout";
import { ListPageState } from "../../state/ListPageState";
import { SortDirection } from "../../state/ListState";
import TableBuilder from "../table-builder/TableBuilder";

interface ListPageProps<Data extends EntityData> {
    title: string;
    bloc: ListBloc<Data>;
}

const useStyles = makeStyles({
    loading: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default function ListPage<Data extends EntityData>({ title, bloc }: ListPageProps<Data>) {
    const classes = useStyles();

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
                builder={(state: ListPageState<Data>) => {
                    switch (state.kind) {
                        case "ListLoadingState": {
                            return (
                                <div className={classes.loading}>
                                    <CircularProgress />
                                </div>
                            );
                        }
                        case "ListErrorState": {
                            return <Alert severity="error">{state.message}</Alert>;
                        }
                        case "NavigateTo": {
                            return <Redirect push to={state.route} />;
                        }
                        case "ListLoadedState": {
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
                        }
                    }
                }}
            />
        </MainLayout>
    );
}
