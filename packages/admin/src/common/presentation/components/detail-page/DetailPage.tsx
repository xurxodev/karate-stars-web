import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { EntityData } from "karate-stars-core";
import { DetailPageParams } from "../../PageRoutes";
import { BlocBuilder } from "../../bloc";
import MainLayout from "../../layouts/main/MainLayout";
import FormBuilder from "../form-builder/FormBuilder";
import DetailBloc from "../../bloc/DetailBloc";
import { DetailPageState } from "../../state/DetailPageState";
import { CircularProgress, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

interface DetailPageProps<Data extends EntityData> {
    bloc: DetailBloc<Data>;
}

export default function DetailPage<Data extends EntityData>({ bloc }: DetailPageProps<Data>) {
    const classes = useStyles();
    const params = useParams<DetailPageParams>();
    const history = useHistory();

    const handleFieldChange = (name: string, value: string | string[]) => {
        bloc.onFieldChanged(name, value);
    };

    useEffect(() => {
        bloc.init(params.id);
    }, [bloc, params]);

    const handleSubmit = () => {
        bloc.submit();
    };

    const handleCancel = () => {
        history.goBack();
    };

    return (
        <BlocBuilder
            bloc={bloc}
            builder={(state: DetailPageState) => {
                switch (state.kind) {
                    case "DetailLoadingState": {
                        return (
                            <div className={classes.loading}>
                                <CircularProgress />
                            </div>
                        );
                    }
                    case "DetailErrorState": {
                        return <Alert severity="error">{state.message}</Alert>;
                    }
                    case "DetailFormUpdatedState": {
                        return (
                            <MainLayout title={state.title}>
                                <FormBuilder
                                    formState={state.form}
                                    onSubmit={handleSubmit}
                                    onCancel={handleCancel}
                                    handleFieldChange={handleFieldChange}
                                />
                            </MainLayout>
                        );
                    }
                }
            }}
        />
    );
}

const useStyles = makeStyles({
    loading: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
});
