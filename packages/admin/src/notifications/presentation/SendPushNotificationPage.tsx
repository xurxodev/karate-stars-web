import React from "react";
import { FormState } from "../../common/presentation/state/FormState";
import MainLayout from "../../common/presentation/layouts/main/MainLayout";
import { di } from "../../CompositionRoot";
import { BlocBuilder } from "../../common/presentation/bloc";
import FormBuilder from "../../common/presentation/components/form-builder/FormBuilder";
import SendPushNotificationBloc from "./SendPushNotificationBloc";

const SendPushNotificationPage: React.FC = () => {
    const bloc = di.get(SendPushNotificationBloc);

    const handleFieldChange = (name: string, value: string) => {
        bloc.onFieldChanged(name, value);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        bloc.submit();
    };

    return (
        <MainLayout title={"Send Push Notification"}>
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

export default SendPushNotificationPage;
