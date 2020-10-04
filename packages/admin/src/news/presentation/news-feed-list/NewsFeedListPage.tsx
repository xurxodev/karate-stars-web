import { CircularProgress, makeStyles, Snackbar, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { NewsFeedRawData } from "karate-stars-core";
import React from "react";
import { BlocBuilder } from "../../../common/presentation/bloc";
import MainLayout from "../../../common/presentation/layouts/main/MainLayout";
import { di } from "../../../CompositionRoot";
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

const NewsFeedListPage: React.FC = () => {
    const classes = useStyles();

    const bloc = di.get(NewsFeedListBloc);

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
                            return (
                                <Snackbar open={true} autoHideDuration={6000}>
                                    <Alert severity="error">{state.message}</Alert>
                                </Snackbar>
                            );
                        }
                        case "ListLoadedState": {
                            return (
                                <React.Fragment>
                                    {state.data.map(feed => (
                                        <Typography key={feed.id}>{feed.name}</Typography>
                                    ))}
                                </React.Fragment>
                            );
                        }
                    }
                }}
            />
        </MainLayout>
    );
};

export default NewsFeedListPage;
