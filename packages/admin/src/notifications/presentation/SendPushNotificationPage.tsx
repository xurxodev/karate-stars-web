import React from "react";
import { makeStyles, Theme } from "@material-ui/core";
import { FormState } from "../../common/presentation/state/FormState";
import MainLayout from "../../common/presentation/layouts/main/MainLayout";
import CompositionRoot from "../../CompositionRoot";
import { BlocBuilder } from "../../common/presentation/bloc";
import FormBuilder from "../../common/presentation/components/form-builder/FormBuilder";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(4),
        flexGrow: 1,
    },
}));

const SendPushNotificationPage: React.FC = () => {
    const classes = useStyles();
    const bloc = CompositionRoot.getInstance().provideSendPushNotificationBloc();
    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();

        bloc.onFieldChanged(event.target.name, event.target.value);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        bloc.submit();
    };

    return (
        <MainLayout>
            <div className={classes.root}>
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
            </div>
        </MainLayout>
    );
};

export default SendPushNotificationPage;
