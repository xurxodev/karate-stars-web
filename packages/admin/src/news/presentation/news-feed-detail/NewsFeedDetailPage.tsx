import React from "react";
import { BlocBuilder } from "../../../common/presentation/bloc";
import FormBuilder from "../../../common/presentation/components/form-builder/FormBuilder";
import MainLayout from "../../../common/presentation/layouts/main/MainLayout";
import { FormState } from "../../../common/presentation/state/FormState";
import { di } from "../../../CompositionRoot";
import NewsFeedDetailBloc from "./NewsFeedDetailBloc";

const NewsFeedDetailPage: React.FC = () => {
    const bloc = di.get(NewsFeedDetailBloc);

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();

        bloc.onFieldChanged(event.target.name, event.target.value);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        bloc.submit();
    };

    return (
        <MainLayout title={"Rss Feed"}>
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
