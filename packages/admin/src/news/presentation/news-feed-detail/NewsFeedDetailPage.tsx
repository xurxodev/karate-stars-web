import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BlocBuilder } from "../../../common/presentation/bloc";
import FormBuilder from "../../../common/presentation/components/form-builder/FormBuilder";
import MainLayout from "../../../common/presentation/layouts/main/MainLayout";
import { DetailPageParams } from "../../../common/presentation/PageRoutes";
import { FormState } from "../../../common/presentation/state/FormState";
import { di } from "../../../CompositionRoot";
import NewsFeedDetailBloc from "./NewsFeedDetailBloc";

const NewsFeedDetailPage: React.FC = () => {
    const params = useParams<DetailPageParams>();
    const bloc = di.get(NewsFeedDetailBloc);

    const handleFieldChange = (name: string, value: string) => {
        bloc.onFieldChanged(name, value);
    };

    useEffect(() => {
        bloc.init(params.id);
    }, [bloc, params]);

    const handleSubmit = (event: any) => {
        event.preventDefault();
        bloc.submit();
    };

    return (
        <MainLayout title={"News Feed"}>
            <BlocBuilder
                bloc={bloc}
                builder={(formState: FormState) => {
                    return (
                        <FormBuilder
                            formState={formState}
                            handleSubmit={handleSubmit}
                            handleFieldChange={handleFieldChange}
                        />
                    );
                }}
            />
        </MainLayout>
    );
};

export default NewsFeedDetailPage;
