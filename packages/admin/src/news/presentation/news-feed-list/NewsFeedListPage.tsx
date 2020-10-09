import { Avatar, CircularProgress, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { NewsFeedRawData } from "karate-stars-core";
import React from "react";
import { Link } from "react-router-dom";
import { BlocBuilder } from "../../../common/presentation/bloc";
import MainLayout from "../../../common/presentation/layouts/main/MainLayout";
import { di } from "../../../CompositionRoot";
import NewsFeedTable, {
    TableColumn,
} from "../../../common/presentation/components/objects-table/ObjectsTable";
import NewsFeedListBloc from "./NewsFeedListBloc";
import { ListState } from "./NewsFeedListState";

const useStyles = makeStyles({
    loading: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
});

const feedAvatar = (feed: NewsFeedRawData) => <Avatar src={feed.image} />;
const feedLink = (feed: NewsFeedRawData) => <Link to={feed.url}>{feed.url}</Link>;

const NewsFeedListPage: React.FC = () => {
    const classes = useStyles();

    const bloc = di.get(NewsFeedListBloc);

    const columns: TableColumn<NewsFeedRawData>[] = [
        { name: "id", text: "Id" },
        {
            name: "image",
            text: "Image",
            getValue: feedAvatar,
        },
        { name: "name", text: "Name" },
        { name: "language", text: "Language" },
        { name: "type", text: "Type" },
        {
            name: "url",
            text: "Url",
            getValue: feedLink,
        },
    ];

    return (
        <MainLayout title={"News Feed List"}>
            <BlocBuilder
                bloc={bloc}
                builder={(state: ListState<NewsFeedRawData>) => {
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
                        case "ListLoadedState": {
                            return <NewsFeedTable rows={state.data} columns={columns} />;
                        }
                    }
                }}
            />
        </MainLayout>
    );
};

export default NewsFeedListPage;
