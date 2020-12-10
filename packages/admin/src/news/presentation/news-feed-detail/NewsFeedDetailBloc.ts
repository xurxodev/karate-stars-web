import { FormState, FormSectionState } from "../../../common/presentation/state/FormState";
import FormBloc from "../../../common/presentation/bloc/FormBloc";
import { NewsFeedRawData, ValidationErrorKey } from "karate-stars-core";
import GetNewsFeedByIdUseCase from "../../domain/GetNewsFeedByIdUseCase";
import { DataError } from "../../../common/domain/Errors";

class NewsFeedDetailBloc extends FormBloc {
    constructor(private getNewsFeedByIdUseCase: GetNewsFeedByIdUseCase) {
        super({
            isValid: false,
            sections: initialFieldsState(),
        });
    }

    async init(id?: string) {
        if (id) {
            const newsFeedResult = await this.getNewsFeedByIdUseCase.execute(id);

            newsFeedResult.fold(
                error => this.changeState(this.handleError(error)),
                newsFeed => {
                    this.changeState({
                        ...this.state,
                        sections: initialFieldsState(newsFeed),
                    });
                }
            );
        }
    }

    protected validateState(_state: FormState): Record<string, ValidationErrorKey[]> | null {
        // const result = this.createNotification(state);
        // const errors = result.fold(
        //     errors => errors,
        //     () => null
        // );
        return null;
    }

    async submit() {
        // if (this.state.isValid) {
        //     const creationResult = this.createNotification(this.state);
        //     const sendResult = await this.sendPushNotificationUseCase.execute(
        //         creationResult.getOrThrow()
        //     );
        //     sendResult.fold(
        //         (error: SendPushNotificationError) => this.changeState(this.handleError(error)),
        //         () =>
        //             this.changeState({
        //                 ...this.state,
        //                 result: {
        //                     kind: "FormResultSuccess",
        //                     message: "Push notification sent successfully",
        //                 },
        //             })
        //     );
        // } else {
        //     this.changeState({ ...this.state });
        // }
    }

    private handleError(error: DataError): FormState {
        switch (error.kind) {
            case "Unauthorized":
                return {
                    ...this.state,
                    result: { kind: "FormResultError", message: "Invalid credentials" },
                };
            case "ApiError":
                return {
                    ...this.state,
                    result: {
                        kind: "FormResultError",
                        message: `Sorry, an error has ocurred in the server. Please try later again`,
                    },
                };
            case "UnexpectedError":
                return {
                    ...this.state,
                    result: {
                        kind: "FormResultError",
                        message: `Sorry, an error has ocurred. Please try later again`,
                    },
                };
        }
    }

    // private createNotification(
    //     state: FormState
    // ): Either<ValidationErrorsDictionary, UrlNotification> {
    //     const notificationDataFields = state.sections.flatMap(section =>
    //         section.fields.map(field => ({ [field.name]: field.value })));
    //     const notificationData = Object.assign({}, ...notificationDataFields);

    //     return UrlNotification.create(notificationData);
    // }
}

export default NewsFeedDetailBloc;

const initialFieldsState = (newsFeed?: NewsFeedRawData): FormSectionState[] => {
    return [
        {
            fields: [
                {
                    label: "Image",
                    name: "image",
                    type: "file",
                    required: true,
                    value: newsFeed?.image,
                    accept: "image/*",
                },
                { label: "Name", name: "name", required: true, value: newsFeed?.name },
                { label: "Url", name: "url", required: true, value: newsFeed?.url },
                { label: "Language", name: "language", required: true, value: newsFeed?.language },
                { label: "Type", name: "type", required: true, value: newsFeed?.type },
            ],
        },
    ];
};
