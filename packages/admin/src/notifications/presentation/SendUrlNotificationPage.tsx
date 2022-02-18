import React from "react";
import { FormState } from "../../common/presentation/state/FormState";
import MainLayout from "../../common/presentation/layouts/main/MainLayout";
import { di } from "../../CompositionRoot";
import { BlocBuilder } from "../../common/presentation/bloc";
import FormBuilder from "../../common/presentation/components/form-builder/FormBuilder";
import SendUrlNotificationBloc from "./SendUrlNotificationBloc";

const SendUrlNotificationPage: React.FC = () => {
    const bloc = di.get(SendUrlNotificationBloc);

    const handleFieldChange = (name: string, value: string | string[] | boolean) => {
        bloc.onFieldChanged(name, value);
    };

    const handleSubmit = () => {
        bloc.submit();
    };

    return (
        <MainLayout title={"Send Url Push Notification"}>
            <BlocBuilder
                bloc={bloc}
                builder={(formState: FormState) => {
                    return (
                        <FormBuilder
                            formState={formState}
                            onSubmit={handleSubmit}
                            handleFieldChange={handleFieldChange}
                        />
                    );
                }}
            />
        </MainLayout>
    );
};

export default SendUrlNotificationPage;
